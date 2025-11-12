# CI/CD Pipeline

Continuous Integration and Deployment setup using GitHub Actions.

## Overview

Automated workflows that run on code changes:

```
Push/PR → GitHub Actions → Tests → Build → Deploy
```

**Triggers**:
- Pull requests → Run tests, lint
- Push to main → Full pipeline + deploy
- Manual → Deployment trigger
- Schedule → Nightly security scans

## Workflows

Located in `.github/workflows/`

### 1. CI Pipeline (`ci.yml`)

Runs on every pull request and push to main.

**Jobs**:
1. **Lint** - ESLint + Prettier
2. **Type Check** - TypeScript compilation
3. **Unit Tests** - Vitest (frontend + backend)
4. **Integration Tests** - API tests
5. **E2E Tests** - Playwright (main branch only)
6. **Build** - Production build test

**Configuration**:
```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Check formatting
        run: npx prettier --check "src/**/*.{ts,tsx}"

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: TypeScript check
        run: npx tsc --noEmit

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --run --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: airbro_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: cd backend && npm ci
      
      - name: Generate Prisma client
        run: cd backend && npm run prisma:generate
      
      - name: Run migrations
        run: cd backend && npm run prisma:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/airbro_test
      
      - name: Run tests
        run: cd backend && npm test -- --run --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/airbro_test
          JWT_SECRET: test_secret_key_for_ci_pipeline

  e2e:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Start backend
        run: cd backend && npm ci && npm run dev &
        env:
          DATABASE_URL: file:./test.db
          JWT_SECRET: test_secret
      
      - name: Wait for backend
        run: npx wait-on http://localhost:3001/health
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build frontend
        run: npm run build
        env:
          VITE_API_BASE_URL: https://api.airbro.com/api
          VITE_TELEGRAM_BOT_USERNAME: airbro_bot
      
      - name: Build backend
        run: cd backend && npm ci && npm run build
```

**Status Checks**:
All jobs must pass before PR can be merged.

### 2. Frontend Deployment (`deploy-frontend.yml`)

Auto-deploys frontend to Vercel on push to main.

**Configuration**:
```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'public/**'
      - 'index.html'
      - 'package.json'
      - 'vite.config.ts'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Required Secrets**:
- `VERCEL_TOKEN`: Vercel authentication token
- `VERCEL_ORG_ID`: Organization ID from Vercel
- `VERCEL_PROJECT_ID`: Project ID from Vercel

**Setup Vercel Secrets**:
```bash
# Get token from vercel.com/account/tokens
# Get org and project IDs from vercel project settings

# Add to GitHub: Settings → Secrets → New repository secret
```

### 3. Backend Deployment (`deploy-backend.yml`)

Auto-deploys backend to Railway on push to main.

**Configuration**:
```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Railway
        uses: railway/railway-action@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

**Required Secrets**:
- `RAILWAY_TOKEN`: Railway project token

**Setup Railway Secret**:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Get token
railway tokens create

# Add to GitHub secrets
```

### 4. Security Scanning (`security.yml`)

Runs security checks on schedule and PRs.

**Configuration**:
```yaml
name: Security Scan

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  pull_request:
    branches: [main]

jobs:
  dependency-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      
      - name: Check for known vulnerabilities
        run: npx audit-ci --moderate

  codeql:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v4
      
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: javascript, typescript
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2

  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: TruffleHog OSS
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
```

## Branch Protection Rules

**Main Branch Rules**:
1. Require pull request reviews (1 approval)
2. Require status checks to pass:
   - lint
   - typecheck
   - test-frontend
   - test-backend
   - build
3. Require branches to be up to date
4. Do not allow force pushes
5. Do not allow deletions

**Setup**:
1. Go to repository Settings → Branches
2. Add rule for `main`
3. Enable rules above

## Secrets Management

### Required Secrets

Add in GitHub repository: Settings → Secrets and variables → Actions

**Vercel**:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

**Railway**:
- `RAILWAY_TOKEN`

**Optional**:
- `CODECOV_TOKEN` (for coverage reports)
- `SENTRY_AUTH_TOKEN` (for error tracking)

### Environment Variables

Set in Vercel and Railway dashboards (not in GitHub Actions).

## Workflow Optimizations

### Caching

**Node Modules**:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

**Playwright Browsers**:
```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ hashFiles('package-lock.json') }}
```

### Parallel Jobs

Jobs run in parallel by default. Use `needs` to create dependencies:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
  
  deploy:
    needs: test  # Only runs if test succeeds
    runs-on: ubuntu-latest
```

### Conditional Execution

```yaml
# Only on main branch
if: github.ref == 'refs/heads/main'

# Only on PRs
if: github.event_name == 'pull_request'

# Only if files changed
on:
  push:
    paths:
      - 'src/**'
```

## Notifications

### Slack Integration

Add to workflow:
```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Build failed: ${{ github.workflow }}"
      }
```

### Email Notifications

GitHub sends emails automatically on workflow failures.

**Configure**: Settings → Notifications → Actions

## Monitoring

### GitHub Actions Dashboard

View workflow runs: Actions tab in repository

**Metrics**:
- Success rate
- Execution time
- Failure reasons

### Third-Party Monitoring

**Codecov** - Code coverage:
```yaml
- uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

**Sentry** - Error tracking:
Automatically captures deployment events.

## Manual Workflows

### Manual Deployment

Add `workflow_dispatch` trigger:
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        type: choice
        options:
          - production
          - staging
```

**Trigger**: Actions → Select workflow → Run workflow

### Rollback

Use manual workflow to deploy previous commit:
```bash
# Via GitHub UI
# Actions → Deploy → Run workflow → Select commit

# Or revert commit locally
git revert HEAD
git push
```

## Performance

### Typical Workflow Times

| Job | Duration |
|-----|----------|
| Lint | ~30s |
| Type Check | ~45s |
| Frontend Tests | ~2 min |
| Backend Tests | ~3 min |
| E2E Tests | ~5 min |
| Build | ~1 min |
| Deploy | ~2 min |
| **Total** | **~10-15 min** |

### Optimization Tips

1. **Use npm ci instead of npm install** (faster)
2. **Cache dependencies** (setup-node does this)
3. **Run jobs in parallel** (default behavior)
4. **Skip unnecessary jobs** (use path filters)
5. **Use smaller Docker images** (if applicable)

## Troubleshooting

### Build Fails Locally Works

**Causes**:
- Different Node version
- Missing environment variables
- Platform-specific code

**Fix**:
```bash
# Match CI Node version
nvm use 20

# Use CI commands
npm ci
npm run build
```

### Tests Pass Locally Fail in CI

**Causes**:
- Timing issues (CI is slower)
- Environment differences
- Database state

**Fix**:
```typescript
// Increase timeouts in tests
test('something', async () => {
  // ...
}, 10000); // 10 second timeout
```

### Secret Not Found

**Error**: `secret VERCEL_TOKEN not found`

**Fix**: Add secret in repository settings, not workflow file.

### E2E Tests Flaky

**Causes**:
- Timing issues
- Race conditions
- Network delays

**Fix**:
```typescript
// Use explicit waits
await page.waitForSelector('[data-testid="loaded"]');

// Retry failed tests
npx playwright test --retries=2
```

## Best Practices

1. **Keep workflows fast** - Under 15 minutes total
2. **Fail fast** - Run quick checks (lint, typecheck) first
3. **Use caching** - Speed up dependency installation
4. **Run E2E only on main** - Too slow for every PR
5. **Monitor workflow costs** - GitHub Actions has usage limits
6. **Use matrix builds** - Test multiple Node versions if needed
7. **Keep secrets secure** - Never log secrets
8. **Test workflow changes** - On feature branch first

## Matrix Builds (Optional)

Test multiple configurations:
```yaml
test:
  strategy:
    matrix:
      node-version: [18, 20]
      os: [ubuntu-latest, windows-latest]
  
  runs-on: ${{ matrix.os }}
  
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
```

## Costs

**GitHub Actions** (Free tier):
- 2,000 minutes/month for private repos
- Unlimited for public repos

**Typical usage**:
- ~15 min per run
- ~10 runs per day (PRs + pushes)
- **~150 min/day = 4,500 min/month**

Exceeds free tier → $8/month for additional 1,000 minutes.

**Optimization**: Run E2E only on main branch saves ~50% time.

---

CI/CD automates testing and deployment, ensuring code quality and fast delivery. Configure once, benefit forever.
