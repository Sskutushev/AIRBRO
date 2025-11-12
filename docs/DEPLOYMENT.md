# Deployment Guide

Complete guide for deploying AIRBRO Business to production environments.

## Architecture

```
Frontend (Vercel) → Backend (Railway) → PostgreSQL (Railway)
       ↓
   CDN (Vercel)
```

## Prerequisites

- [Vercel Account](https://vercel.com) - Frontend hosting
- [Railway Account](https://railway.app) - Backend + Database
- [GitHub Repository](https://github.com) - Source code
- Domain (optional) - Custom domain

## Quick Deploy

### 1. Fork Repository

Fork [AIRBRO-Business](https://github.com/Sskutushev/AIRBRO-Business) to your GitHub account.

### 2. Deploy Database

**Railway**:
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Provision PostgreSQL"
3. Note the `DATABASE_URL` from Variables tab

### 3. Deploy Backend

**Railway**:
1. Click "New" → "GitHub Repo"
2. Select your forked repository
3. Set root directory: `/backend`
4. Add environment variables (see below)
5. Deploy

**Environment Variables**:
```env
DATABASE_URL=postgresql://user:pass@host:5432/railway
JWT_SECRET=your-random-secret-key-32-chars-min
TELEGRAM_BOT_TOKEN=your:telegram:bot:token
TELEGRAM_BOT_USERNAME=your_bot_username
USDT_TRC20_WALLET=your_trc20_wallet_address
USDT_ERC20_WALLET=your_erc20_wallet_address
TON_WALLET=your_ton_wallet_address
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend.vercel.app
```

**Post-deployment**:
```bash
# SSH into Railway container (or use Railway CLI)
railway run npm run prisma:generate
railway run npm run prisma:migrate
railway run npm run prisma:seed  # Optional: seed products
```

Note your backend URL: `https://your-backend.up.railway.app`

### 4. Deploy Frontend

**Vercel**:
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Framework Preset: Vite
5. Root Directory: `./` (default)
6. Add environment variables (see below)
7. Deploy

**Environment Variables**:
```env
VITE_API_BASE_URL=https://your-backend.up.railway.app/api
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
VITE_SENTRY_DSN=your_sentry_dsn  # Optional
```

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 5. Update CORS

Update backend CORS settings to allow your Vercel domain:

```typescript
// backend/src/server.ts
app.use(cors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true
}));
```

Redeploy backend.

### 6. Test Deployment

1. Visit your Vercel URL
2. Test user registration
3. Test Telegram login
4. Add product to cart
5. Create test payment

## Detailed Deployment

### Database Setup (Railway)

**Create Database**:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Add PostgreSQL
railway add postgresql

# Get connection string
railway variables
```

**Run Migrations**:
```bash
# Set DATABASE_URL locally
export DATABASE_URL="postgresql://..."

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate deploy

# Seed data (optional)
npm run prisma:seed
```

### Backend Deployment (Railway)

**Option 1: GitHub Integration (Recommended)**

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Auto-deploys on push to main

**Option 2: Railway CLI**

```bash
# Link project
railway link

# Deploy
railway up

# View logs
railway logs
```

**Health Check**:
```bash
curl https://your-backend.up.railway.app/health
```

Should return:
```json
{"status":"ok","timestamp":"...","uptime":123}
```

### Frontend Deployment (Vercel)

**Option 1: Vercel Dashboard (Recommended)**

1. Import project from GitHub
2. Configure as described above
3. Auto-deploys on push to main

**Option 2: Vercel CLI**

```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Custom Domain**:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS:
   - Type: `CNAME`
   - Name: `@` (or `www`)
   - Value: `cname.vercel-dns.com`

**Environment Variables**:

Add via Vercel dashboard or CLI:
```bash
vercel env add VITE_API_BASE_URL production
# Enter value: https://your-backend.up.railway.app/api
```

## Environment Variables Reference

### Backend Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for signing JWT tokens | Random 32+ character string |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | `123456:ABC-DEF...` |
| `TELEGRAM_BOT_USERNAME` | Telegram bot username | `airbro_bot` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://airbro.vercel.app` |

### Backend Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection for rate limiting | In-memory store |
| `LOG_LEVEL` | Winston log level | `info` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

### Frontend Required

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://api.airbro.com/api` |
| `VITE_TELEGRAM_BOT_USERNAME` | Telegram bot username | `airbro_bot` |

### Frontend Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_SENTRY_DSN` | Sentry error tracking DSN | None |
| `VITE_GA_TRACKING_ID` | Google Analytics ID | None |

## SSL/HTTPS

Both Vercel and Railway provide automatic HTTPS:
- **Vercel**: Automatic Let's Encrypt certificates
- **Railway**: Automatic SSL for Railway domains

For custom domains, follow provider instructions.

## Database Backups

### Railway Backups

Railway provides automatic daily backups. Configure in dashboard:
1. Go to Database → Settings
2. Enable Automatic Backups
3. Set retention period

### Manual Backups

```bash
# Export database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore database
psql $DATABASE_URL < backup-20241112.sql
```

**Automated Backups Script**:
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d)
pg_dump $DATABASE_URL | gzip > backup-$DATE.sql.gz
# Upload to S3, Google Cloud Storage, etc.
```

## Monitoring & Logs

### Backend Logs (Railway)

```bash
# View logs
railway logs

# Follow logs
railway logs --follow

# Filter logs
railway logs | grep ERROR
```

### Frontend Logs (Vercel)

1. Go to Vercel Dashboard
2. Select project → Deployments
3. Click deployment → View Logs

### Error Tracking (Sentry)

1. Create [Sentry](https://sentry.io) account
2. Create new project (React + Node.js)
3. Get DSN from Project Settings
4. Add to environment variables
5. Sentry automatically captures errors

## Performance Optimization

### Frontend

**Vercel Settings**:
- Enable compression (automatic)
- Set cache headers:
  ```json
  // vercel.json
  {
    "headers": [
      {
        "source": "/assets/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
  ```

**Image Optimization**:
```bash
# Optimize before deploying
npm run optimize:images
```

### Backend

**Database Connection Pooling**:
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connectionLimit = 10
}
```

**Enable Compression**:
```typescript
// backend/src/server.ts
import compression from 'compression';
app.use(compression());
```

## Scaling

### Horizontal Scaling (Backend)

Railway supports multiple instances:
1. Go to Service → Settings
2. Increase replicas
3. Enable Redis for shared rate limiting

### Database Scaling

Railway offers:
- **Vertical**: Increase CPU/RAM
- **Read Replicas**: For read-heavy workloads
- **Connection Pooling**: PgBouncer

### CDN (Frontend)

Vercel's Edge Network automatically distributes content globally.

## Rollback

### Backend Rollback (Railway)

1. Go to Deployments
2. Click previous deployment
3. Click "Redeploy"

```bash
# Or via CLI
railway status
railway rollback <deployment-id>
```

### Frontend Rollback (Vercel)

1. Go to Deployments
2. Find stable deployment
3. Click three dots → Promote to Production

```bash
# Or via CLI
vercel rollback
```

## Health Checks

### Backend Health Check

```bash
curl https://your-backend.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-11-12T12:34:56.789Z",
  "uptime": 12345,
  "database": "connected"
}
```

### Frontend Health Check

```bash
curl -I https://your-frontend.vercel.app
```

Should return `200 OK`.

## Troubleshooting

### Database Connection Failed

**Check**:
```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Verify environment variable
railway variables | grep DATABASE_URL
```

**Fix**: Ensure DATABASE_URL is correct and database is running.

### CORS Errors

**Symptoms**: Frontend can't reach backend, browser shows CORS error.

**Fix**:
1. Verify FRONTEND_URL in backend environment
2. Check CORS configuration in `server.ts`
3. Ensure HTTPS (not HTTP)

### Build Failures (Vercel)

**Common Issues**:
- Missing environment variables
- TypeScript errors
- Dependency issues

**Fix**:
```bash
# Test build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

### Rate Limiting Issues

**Symptoms**: 429 errors in production.

**Fix**:
1. Increase rate limits for production
2. Use Redis for distributed rate limiting
3. Whitelist known IPs (if applicable)

## Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Products seeded in database
- [ ] CORS configured correctly
- [ ] SSL certificates active (automatic)
- [ ] Health checks passing
- [ ] Error tracking enabled (Sentry)
- [ ] Database backups scheduled
- [ ] Custom domain configured (if applicable)
- [ ] Analytics setup (Google Analytics)
- [ ] Rate limiting tested
- [ ] Payment wallets configured
- [ ] Telegram bot setup and tested
- [ ] E2E tests passing
- [ ] Monitoring alerts configured

## Maintenance

### Regular Tasks

**Weekly**:
- Review error logs (Sentry)
- Check database usage
- Monitor response times

**Monthly**:
- Update dependencies
- Review security advisories
- Test backups

**Quarterly**:
- Review and optimize database queries
- Audit user permissions
- Performance testing

### Updates

```bash
# Update dependencies
npm update
npm audit fix

# Update Prisma
npm install @prisma/client@latest prisma@latest
npx prisma generate
npx prisma migrate deploy
```

## Costs

**Estimated Monthly Costs** (as of 2024):

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Hobby | Free (or $20/mo Pro) |
| Railway | Starter | ~$5-20/mo |
| Database | Shared | Included with Railway |
| Domain | .com | ~$12/year |
| **Total** | | **~$5-40/mo** |

**Scaling Costs**:
- More backend instances: +$5/instance
- Larger database: +$10-50/mo
- CDN bandwidth: Included (Vercel)

---

For production support, refer to provider documentation or contact support teams.
