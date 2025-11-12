# Environment Variables Setup Guide

This guide explains how to configure environment variables for production deployment on Vercel (frontend) and Railway (backend).

## Quick Fix for Current Issues

### Issue: CORS and API Connection Errors

**Symptoms:**
- "Access to fetch has been blocked by CORS policy"
- "Network error. Please check your internet connection"
- Requests going to localhost:3000 on production

**Solution:**

### 1. Vercel (Frontend) Environment Variables

Go to your Vercel project → Settings → Environment Variables

Add these variables:

```env
VITE_API_URL=https://airbro-production.up.railway.app
VITE_USE_MOCK_API=false
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
VITE_SENTRY_DSN=your_sentry_dsn
VITE_GA_MEASUREMENT_ID=your_ga_id
```

**Important:** After adding variables, you MUST redeploy:
```bash
# Go to Vercel Deployments tab
# Click "..." on latest deployment
# Click "Redeploy"
```

### 2. Railway (Backend) Environment Variables

Go to your Railway project → Variables tab

Add these variables:

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://airbro-mrqs.vercel.app
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRES_IN=7d
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_ADMIN_CHANNEL=your_admin_channel_id
USDT_TRC20_WALLET=your_trc20_wallet
USDT_ERC20_WALLET=your_erc20_wallet
TON_WALLET=your_ton_wallet
```

**Important:** After adding variables, Railway will automatically redeploy.

### 3. Verify Changes

After redeployment:

1. Check Vercel deployment logs:
   - Go to Vercel → Deployments → Latest → Logs
   - Look for: "VITE_API_URL=https://airbro-production.up.railway.app"

2. Check Railway backend logs:
   - Go to Railway → Deployments → View Logs
   - Look for: "🌍 Frontend URL: https://airbro-mrqs.vercel.app"

3. Test authentication:
   - Go to https://airbro-mrqs.vercel.app
   - Try to register/login
   - Check browser console (F12) for errors

## Detailed Configuration

### Frontend Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://airbro-production.up.railway.app` |
| `VITE_USE_MOCK_API` | Use mock API for testing | `false` |
| `VITE_TELEGRAM_BOT_USERNAME` | Telegram bot username | `airbro_bot` |
| `VITE_SENTRY_DSN` | Sentry error tracking DSN | Optional |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID | Optional |

### Backend Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `FRONTEND_URL` | Frontend URL (for CORS) | `https://airbro-mrqs.vercel.app` |
| `DATABASE_URL` | PostgreSQL connection string | Provided by Railway |
| `JWT_SECRET` | Secret key for JWT tokens | Random 32+ chars |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | From BotFather |
| `USDT_TRC20_WALLET` | USDT TRC20 wallet address | Your wallet |
| `USDT_ERC20_WALLET` | USDT ERC20 wallet address | Your wallet |
| `TON_WALLET` | TON wallet address | Your wallet |

## Common Issues

### 1. "localhost:3000" in Production Requests

**Problem:** Frontend is making requests to localhost instead of production API.

**Solution:**
- Verify `VITE_API_URL` is set in Vercel
- Redeploy Vercel after adding the variable
- Check deployment logs to confirm variable is set

### 2. CORS Errors

**Problem:** "Access to fetch has been blocked by CORS policy"

**Solution:**
- Verify `FRONTEND_URL` is set in Railway backend
- Make sure it matches your Vercel domain exactly
- Check backend logs for "CORS blocked request from origin"
- Redeploy Railway backend

### 3. 401 Unauthorized

**Problem:** Auth requests return 401 errors.

**Solution:**
- Check `JWT_SECRET` is set in Railway
- Verify it's at least 32 characters long
- Clear browser localStorage and try again

### 4. Database Connection Failed

**Problem:** Backend can't connect to database.

**Solution:**
- Check `DATABASE_URL` in Railway
- Should be PostgreSQL connection string
- Format: `postgresql://user:password@host:port/database`

## Testing Locally

Before deploying, test with production-like environment:

### Frontend
```bash
# Create .env.local file
echo "VITE_API_URL=https://airbro-production.up.railway.app" > .env.local
echo "VITE_USE_MOCK_API=false" >> .env.local

# Run dev server
npm run dev
```

### Backend
```bash
cd backend

# Create .env.local file
echo "FRONTEND_URL=http://localhost:5173" > .env.local
echo "DATABASE_URL=your_local_db_url" >> .env.local
echo "JWT_SECRET=test_secret_key_minimum_32_characters_long" >> .env.local

# Run dev server
npm run dev
```

## Deployment Checklist

Before deploying to production:

- [ ] All required environment variables set in Vercel
- [ ] All required environment variables set in Railway
- [ ] `VITE_API_URL` points to Railway backend
- [ ] `FRONTEND_URL` points to Vercel frontend
- [ ] `JWT_SECRET` is at least 32 characters
- [ ] Database migrations run on Railway
- [ ] Test authentication locally first
- [ ] Check browser console for errors
- [ ] Check Railway logs for CORS errors
- [ ] Clear browser cache and cookies

## Getting Help

If you're still experiencing issues:

1. Check browser console (F12) for detailed errors
2. Check Railway logs for backend errors
3. Verify all URLs are HTTPS (not HTTP)
4. Try clearing browser cache and localStorage
5. Test with a different browser or incognito mode

## Quick Commands

### Generate JWT Secret
```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Check Deployment Status
```bash
# Vercel
vercel ls

# Railway
railway status
```

### View Logs
```bash
# Vercel (via CLI)
vercel logs

# Railway (via CLI)
railway logs
```
