# CI/CD Pipeline AIBRO Business

## Обзор

Пайплайн непрерывной интеграции и доставки (CI/CD) для проекта AIBRO Business обеспечивает автоматизированный процесс тестирования, проверки качества, сборки и развертывания приложения. Система использует GitHub Actions как основную платформу CI/CD с интеграцией с различными сервисами для обеспечения надежного и безопасного процесса доставки изменений.

## Архитектура CI/CD

### Основные компоненты:
- **GitHub Actions** - платформа для выполнения пайплайнов
- **Vercel** - платформа для развертывания frontend
- **Railway/Render** - платформа для развертывания backend
- **Codecov** - сервис анализа покрытия кода тестами
- **Sentry** - мониторинг ошибок в production
- **Google Analytics** - аналитика пользовательского взаимодействия
- **Slack/Telegram** - уведомления о статусе сборок

## Структура пайплайнов

```
.github/
└── workflows/
    ├── ci.yml                   # Основной процесс CI
    ├── frontend-cd.yml          # Деплой фронтенда
    ├── backend-cd.yml           # Деплой бэкенда
    ├── security-scan.yml        # Сканирование безопасности
    ├── performance-test.yml     # Тестирование производительности
    ├── e2e-tests.yml            # E2E тесты
    ├── scheduled-security.yml   # Периодические проверки безопасности
    └── release.yml              # Процесс релизов
```

## Основной процесс CI (ci.yml)

### Проверка качества кода:
```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20.x'

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    outputs:
      changes_detected: ${{ steps.changes.outputs.lint_changed != 'false' }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Detect changes
        id: changes
        run: |
          if git diff --name-only ${{ github.event.pull_request.base.sha }} ${{ github.sha }} | grep -qE '\.(ts|tsx|js|jsx|json)$'; then
            echo "lint_changed=true" >> $GITHUB_OUTPUT
          else
            echo "lint_changed=false" >> $GITHUB_OUTPUT
          fi

      - name: Setup Node.js
        if: steps.changes.outputs.lint_changed == 'true'
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        if: steps.changes.outputs.lint_changed == 'true'
        run: npm ci

      - name: Run ESLint
        if: steps.changes.outputs.lint_changed == 'true'
        run: npm run lint

      - name: Run TypeScript type checking
        if: steps.changes.outputs.lint_changed == 'true'
        run: npm run type-check

  unit-tests:
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    if: needs.lint-and-type-check.outputs.changes_detected == 'true'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --ci --coverage --coverageReporters=text-summary

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          file: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-unit-tests

  security-audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level moderate

      - name: Run CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

### Сборка проекта:
```yaml
  build-frontend:
    runs-on: ubuntu-latest
    needs: [lint-and-type-check, unit-tests]
    if: needs.lint-and-type-check.outputs.changes_detected != 'false'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build frontend
        run: npm run build
        env:
          NODE_ENV: production
          VITE_API_URL: ${{ secrets.VITE_API_URL_PRODUCTION }}
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
          VITE_GA_MEASUREMENT_ID: ${{ secrets.VITE_GA_MEASUREMENT_ID }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: frontend-build
          path: dist/
          retention-days: 30

  build-backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: 'backend/package-lock.json'

      - name: Install backend dependencies
        run: npm ci --only=production

      - name: Build backend
        run: npm run build
        env:
          NODE_ENV: production

      - name: Upload backend artifacts
        uses: actions/upload-artifact@v4
        with:
          name: backend-build
          path: backend/dist/
          retention-days: 30
```

## Frontend Deployment (frontend-cd.yml)

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
  workflow_run:
    workflows: ["CI Pipeline"]
    types: [completed]
    branches: [main]

env:
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    environment: production
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build frontend
        run: npm run build
        env:
          NODE_ENV: production
          VITE_API_URL: ${{ secrets.VITE_API_URL_PRODUCTION }}
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
          VITE_GA_MEASUREMENT_ID: ${{ secrets.VITE_GA_MEASUREMENT_ID }}

      - name: Deploy to Vercel
        id: deploy
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ env.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ env.VERCEL_ORG_ID }}
          vercel-project-id: ${{ env.VERCEL_PROJECT_ID }}
          working-directory: .
          vercel-args: '--prod'

      - name: Wait for deployment
        run: sleep 30

      - name: Verify deployment
        run: |
          curl -f https://aibrobusiness.com/health || exit 1

      - name: Notify Slack on success
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: '✅ Frontend deployed successfully to production. URL: https://aibrobusiness.com'
          channel: '#deployments'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

      - name: Notify on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: '❌ Frontend deployment failed. Check logs: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}'
          channel: '#deployments'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## Backend Deployment (backend-cd.yml)

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths: ['backend/**']

env:
  NODE_VERSION: '20.x'

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    environment: production
    defaults:
      run:
        working-directory: ./backend

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: 'backend/package-lock.json'

      - name: Install backend dependencies
        run: npm ci --only=production

      - name: Run database migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Deploy to Railway
        run: |
          curl -X POST \
            https://api.railway.app/v1/projects/${{ secrets.RAILWAY_PROJECT_ID }}/deployments \
            -H "Authorization: Bearer ${{ secrets.RAILWAY_TOKEN }}" \
            -F "projectId=${{ secrets.RAILWAY_PROJECT_ID }}"
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_ADMIN_CHANNEL: ${{ secrets.TELEGRAM_ADMIN_CHANNEL }}
          USDT_TRC20_WALLET: ${{ secrets.USDT_TRC20_WALLET }}
          USDT_ERC20_WALLET: ${{ secrets.USDT_ERC20_WALLET }}
          TON_WALLET: ${{ secrets.TON_WALLET }}

      - name: Health check
        run: |
          timeout 60s bash -c 'until curl -f http://aibro-business-backend.railway.app/health; do sleep 5; done' || \
          (echo "Health check failed" && exit 1)

      - name: Notify Slack on success
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: '✅ Backend deployed successfully to production'
          channel: '#deployments'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## E2E Тесты (e2e-tests.yml)

```yaml
name: E2E Tests

on:
  schedule:
    - cron: '0 2 * * 1'  # Weekly
  workflow_dispatch:
  pull_request:
    branches: [main]
    paths:
      - 'src/**'
      - 'e2e/**'

env:
  NODE_VERSION: '20.x'

jobs:
  e2e-tests:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npx playwright test
        env:
          CI: true
          BASE_URL: http://localhost:3000

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Upload videos and traces
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: e2e-test-results
          path: e2e/test-results/
          retention-days: 14
```

## Security Scan (security-scan.yml)

```yaml
name: Security Scan

on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly
  push:
    branches: [main, develop]
    paths: ['package-lock.json', 'backend/package-lock.json']

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: '20.x'

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Run npm audit
        run: npm audit --audit-level moderate

      - name: Run CodeQL Analysis
        uses: github/codeql-action/init@v2
        with:
          languages: javascript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2

      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --fail-on=all

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
        continue-on-error: true

  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run TruffleHog
        uses: trufflesecurity/truffleHog@main
        with:
          path: ./
          branch: ${{ github.ref_name }}
```

## Performance Testing (performance-test.yml)

```yaml
name: Performance Tests

on:
  workflow_run:
    workflows: ["CI Pipeline"]
    types: [completed]
    branches: [main]

jobs:
  performance-test:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
          LHCI_TOKEN: ${{ secrets.LHCI_TOKEN }}
          LHCI_BUILD_CONTEXT__CURRENT_SHA: ${{ github.sha }}
          LHCI_BUILD_CONTEXT__CURRENT_BRANCH: ${{ github.ref_name }}

      - name: Run bundle size check
        run: |
          npm install -g @size-limit/github-action
          npx @size-limit/github-action
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SIZE_LIMIT_TOKEN: ${{ secrets.SIZE_LIMIT_TOKEN }}
```

## Configuration files

### package.json scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:unit": "vitest run",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "npx playwright test",
    "test:perf": "lighthouse http://localhost:5173 --output html --output-path ./reports/performance.html",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css,md}\"",
    "analyze": "npm run build && npx vite-bundle-visualizer",
    "security-check": "npm audit --audit-level moderate"
  }
}
```

## Secrets Management

### GitHub Actions Secrets:
```
# Frontend
VITE_API_URL_PRODUCTION=production_api_url
VITE_SENTRY_DSN=sentry_dsn_for_frontend
VITE_GA_MEASUREMENT_ID=google_analytics_measurement_id
VERCEL_TOKEN=vercel_access_token
VERCEL_ORG_ID=vercel_organization_id
VERCEL_PROJECT_ID=vercel_project_id

# Backend
DATABASE_URL=database_connection_string
JWT_SECRET=jwt_secret_key
TELEGRAM_BOT_TOKEN=telegram_bot_token
TELEGRAM_ADMIN_CHANNEL=telegram_channel_id
USDT_TRC20_WALLET=trc20_wallet_address
USDT_ERC20_WALLET=erc20_wallet_address
TON_WALLET=ton_wallet_address
RAILWAY_TOKEN=railway_token
RAILWAY_PROJECT_ID=railway_project_id

# Analytics & Monitoring
SLACK_WEBHOOK=slack_webhook_url
CODECOV_TOKEN=codecov_token
SNYK_TOKEN=snyk_token
LHCI_TOKEN=lhci_token
LHCI_GITHUB_APP_TOKEN=lhci_github_app_token

# Security
SENTRY_AUTH_TOKEN=sentry_auth_token
GITHUB_TOKEN=github_token_with_permissions
```

## Quality Gates

### Проверки перед мерджем:
1. **Код должен пройти линтинг** - ESLint без ошибок
2. **Типизация** - TypeScript компиляция без ошибок
3. **Тесты** - Все unit тесты должны проходить
4. **Покрытие** - Не менее 70% покрытия кода
5. **Безопасность** - Нет критических уязвимостей
6. **Производительность** - Core Web Vitals в пределах нормы

### Автоматические проверки:
- **Size Limit**: Проверка размера bundle
- **Bundle Analysis**: Автоматический анализ сборки
- **Dependency Check**: Проверка устаревших зависимостей
- **License Check**: Проверка лицензий зависимостей

## Pre-commit hooks

### .lintstagedrc:
```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,yaml,yml}": [
    "prettier --write"
  ]
}
```

### .husky/pre-commit:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

## Релизный процесс

### Semantic Versioning:
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward-compatible)
- **PATCH**: Bug fixes (backward-compatible)

### Release Workflow:
```yaml
name: Release Process

on:
  workflow_dispatch:
    inputs:
      version_type:
        description: 'Version type (major, minor, patch)'
        required: true
        default: 'patch'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'

      - name: Bump version
        run: npm version ${{ github.event.inputs.version_type }} -m "Release: v%s [skip ci]"

      - name: Push changes
        run: git push && git push --tags
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Create GitHub release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ steps.bump.outputs.tag }}
          release_name: Release ${{ steps.bump.outputs.tag }}
          body: ${{ steps.changelog.outputs.changes }}
```

## Стратегии деплоя

### Frontend:
- **Vercel**: Auto-scaling, CDN, edge deployment
- **Preview Builds**: Для каждого PR
- **Production Build**: Для main branch
- **Rollback**: Автоматический при сбоях
- **Environment**: Отделение staging/production

### Backend:
- **Railway**: Container-based deployment
- **Environment Promotion**: Промоушн конфигураций
- **Database Migrations**: Автоматические миграции
- **Blue-Green**: Без простоев

## Уведомления и мониторинг

### Slack Integration:
```yaml
- GitHub notifications: Уведомления о деплоях
- CI status: Статус сборки
- Error alerts: Оповещения об ошибках
- Performance metrics: Показатели производительности
```

### Sentry Integration:
- Мониторинг ошибок в реальном времени
- Сбор информации о сбоях
- Уведомления о критических ошибках
- Слежение за качеством релизов

## Восстановление после сбоев

### Rollback Procedures:
1. **Automatic Rollback** - при сбоях деплоя
2. **Manual Rollback** - через GitHub Actions
3. **Database Rollback** - через Prisma миграции
4. **Configuration Rollback** - через environment promotion

### Incident Response:
- **Alerting**: Автоматические оповещения
- **Escalation**: По времени реакции
- **Documentation**: Шаблоны инцидентов
- **Post-mortems**: Анализ после инцидентов

## Масштабирование CI/CD

### Будущие улучшения:
1. **Кеширование зависимостей** - Улучшенное кеширование
2. **Параллелизация** - Максимизация параллельных задач
3. **Self-hosted Runners** - Для специфичных задач
4. **Infrastructure as Code** - Terraform для CI/CD инфраструктуры
5. **Advanced Monitoring** - Показатели CI/CD эффективности
6. **Security Hardening** - Улучшенная безопасность пайплайнов

## Best Practices

### Security:
- **Least Privilege**: Минимальные разрешения для роботов
- **Secret Rotation**: Регулярная смена токенов
- **Audit Logs**: Отслеживание всех действий
- **Dependency Scanning**: Регулярная проверка уязвимостей

### Performance:
- **Early Failures**: Быстрые проверки в начале
- **Smart Caching**: Эффективное кеширование
- **Parallel Execution**: Параллельный запуск тестов
- **Resource Optimization**: Эффективное использование ресурсов

### Maintainability:
- **Reusable Actions**: Общие компоненты пайплайнов
- **Template Management**: Шаблоны для новых проектов
- **Documentation**: Документация всех процессов
- **Regular Reviews**: Периодический аудит пайплайнов

### Code Quality:
- **Automated Checks**: Линтинг и форматирование
- **Type Safety**: Проверка типов
- **Testing**: Unit, integration, e2e
- **Security**: Автоматическое сканирование

---

## Заключение

Этот CI/CD пайплайн обеспечивает стабильную, безопасную и эффективную доставку изменений с автоматизированной проверкой качества кода, безопасности и производительности. Архитектура пайплайна спроектирована с учетом лучших практик DevOps и обеспечивает надежную инфраструктуру для непрерывной доставки AIBRO Business.