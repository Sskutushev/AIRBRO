# 6. Deployment Guide

This guide provides detailed instructions for deploying the AIRBRO Business application to production environments. It covers both frontend and backend deployment strategies, environment variable configuration, and continuous integration/continuous deployment (CI/CD) using GitHub Actions.

## 1. Frontend Deployment (Vercel)

The frontend application is built with Vite and React, making it ideal for deployment on platforms like Vercel, Netlify, or GitHub Pages. This guide focuses on Vercel due to its seamless integration with GitHub and excellent developer experience.

### 1.1. Vercel Setup

1.  **Create a Vercel Account:** If you don't have one, sign up at [vercel.com](https://vercel.com/).
2.  **Connect GitHub Repository:** Import your AIRBRO Business GitHub repository into Vercel.
3.  **Configure Project:**
    *   **Root Directory:** Ensure the root directory is set to `/` (the project root).
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
    *   **Install Command:** `npm install`

### 1.2. Environment Variables

Configure the following environment variables in your Vercel project settings (under "Settings" -> "Environment Variables"). These are crucial for the frontend to communicate with your deployed backend and monitoring services.

| Variable Name           | Description                                                              | Example Value                               |
|-------------------------|--------------------------------------------------------------------------|---------------------------------------------|
| `VITE_API_URL`          | The base URL of your deployed backend API.                               | `https://api.yourdomain.com`                |
| `VITE_SENTRY_DSN`       | Your Sentry DSN for frontend error monitoring (optional).                | `https://example@sentry.io/1234567`         |
| `VITE_GA_MEASUREMENT_ID`| Your Google Analytics Measurement ID for tracking (optional).            | `G-XXXXXXXXXX`                              |

### 1.3. Deployment Process

Once configured, Vercel will automatically deploy your frontend every time you push changes to the main branch (or any branch you configure).

## 2. Backend Deployment (VPS/Cloud Provider)

The Node.js/Express backend with Prisma is designed to be flexible and can be deployed on various cloud providers (e.g., DigitalOcean Droplets, AWS EC2, Google Cloud Compute Engine) or a Virtual Private Server (VPS). This guide assumes a Linux-based server.

### 2.1. Server Preparation

1.  **Provision a Server:** Set up a new Linux server (e.g., Ubuntu 22.04 LTS).
2.  **Install Dependencies:**
    *   **Node.js & npm:** Install the latest LTS version.
    *   **Git:** `sudo apt install git`
    *   **PostgreSQL Client (if using PostgreSQL):** `sudo apt install postgresql-client`
    *   **PM2 (Process Manager):** `npm install -g pm2` (for keeping your app running).

### 2.2. Database Setup (PostgreSQL Recommended for Production)

While SQLite is used for development, **PostgreSQL is highly recommended for production environments** due to its robustness, scalability, and concurrency features.

1.  **Install PostgreSQL:** `sudo apt install postgresql postgresql-contrib`
2.  **Create Database and User:**
    ```bash
    sudo -u postgres psql
    CREATE DATABASE airbro_db;
    CREATE USER airbro_user WITH ENCRYPTED PASSWORD 'your_strong_password';
    GRANT ALL PRIVILEGES ON DATABASE airbro_db TO airbro_user;
    \q
    ```
3.  **Update Prisma Schema:** In `backend/prisma/schema.prisma`, change `datasource db` provider to `postgresql`.
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```
4.  **Generate Prisma Client:**
    ```bash
    cd backend
    npx prisma generate
    ```

### 2.3. Environment Variables

Create a `.env` file in your `backend` directory on the server. **These variables are critical for security and functionality.**

| Variable Name           | Description                                                              | Example Value                               |
|-------------------------|--------------------------------------------------------------------------|---------------------------------------------|
| `NODE_ENV`              | Set to `production`.                                                     | `production`                                |
| `PORT`                  | The port your backend will listen on (e.g., `3000`).                     | `3000`                                      |
| `FRONTEND_URL`          | The URL of your deployed frontend application.                           | `https://yourfrontend.com`                  |
| `DATABASE_URL`          | Your PostgreSQL connection string.                                       | `postgresql://airbro_user:your_strong_password@localhost:5432/airbro_db?schema=public` |
| `JWT_SECRET`            | A strong, random secret for JWT signing.                                 | `your-super-secret-jwt-key-that-is-at-least-32-characters-long` |
| `TELEGRAM_BOT_TOKEN`    | Your Telegram Bot API token.                                             | `YOUR_TELEGRAM_BOT_TOKEN`                   |
| `TELEGRAM_ADMIN_CHANNEL`| The ID of your Telegram admin channel.                                   | `YOUR_TELEGRAM_ADMIN_CHANNEL_ID`            |
| `USDT_TRC20_WALLET`     | Wallet address for USDT TRC20 payments.                                  | `YOUR_TRC20_WALLET_ADDRESS`                 |
| `USDT_ERC20_WALLET`     | Wallet address for USDT ERC20 payments.                                  | `YOUR_ERC20_WALLET_ADDRESS`                 |
| `TON_WALLET`            | Wallet address for TON payments.                                         | `YOUR_TON_WALLET_ADDRESS`                   |
| `SENTRY_DSN`            | Your Sentry DSN for backend error monitoring (optional).                 | `https://example@sentry.io/1234567`         |

### 2.4. Deployment Steps

1.  **Clone Repository:**
    ```bash
    git clone https://github.com/Sskutushev/AIRBRO-Business.git
    cd AIRBRO-Business/backend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install --production
    ```
3.  **Run Prisma Migrations:**
    ```bash
    npx prisma migrate deploy
    ```
4.  **Build Backend:**
    ```bash
    npm run build
    ```
5.  **Start with PM2:**
    ```bash
    pm2 start dist/server.js --name "airbro-backend"
    pm2 save
    pm2 startup
    ```
    This will start your backend, ensure it restarts on crashes, and automatically starts on server boot.

### 2.5. Web Server (Nginx/Apache)

For production, it's highly recommended to use a web server like Nginx or Apache as a reverse proxy to handle SSL/TLS, load balancing, and serve static files.

**Example Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000; # Or whatever port your backend runs on
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Remember to configure SSL/TLS (e.g., with Certbot) for HTTPS.

## 3. CI/CD with GitHub Actions

The project includes GitHub Actions workflows for automating testing and deployment.

-   `.github/workflows/ci.yml`: Runs tests on every push and pull request.
-   `.github/workflows/deploy-frontend.yml`: Deploys the frontend to Vercel (or similar) on pushes to the `main` branch.
-   `.github/workflows/deploy-backend.yml`: Deploys the backend to your server via SSH/Docker on pushes to the `main` branch. (Requires server SSH keys and Docker setup in GitHub Secrets).

## 4. Monitoring & Analytics Setup

### 4.1. Sentry

-   **Frontend:** Configure `VITE_SENTRY_DSN` in Vercel environment variables.
-   **Backend:** Configure `SENTRY_DSN` in your server's backend `.env` file.
-   Ensure your Sentry project is set up to receive events from both frontend (browser) and backend (Node.js) SDKs.

### 4.2. Google Analytics

-   **Frontend:** Configure `VITE_GA_MEASUREMENT_ID` in Vercel environment variables.
-   Ensure your Google Analytics 4 (GA4) property is correctly set up.

## 5. Post-Deployment Checks

After deployment, verify the following:
-   **Frontend:** Access your frontend URL and ensure all pages load correctly.
-   **Backend:** Access your backend API URL (e.g., `/api/health`) and ensure it returns `{"status": "OK"}`.
-   **Logs:** Check PM2 logs (`pm2 logs airbro-backend`) for any errors.
-   **Functionality:** Test key features like user registration, login, product browsing, adding to cart, and initiating payments.
