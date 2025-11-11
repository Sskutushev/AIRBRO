# 10_Security.md: Security Best Practices

This document outlines security best practices and guidelines for the AIRBRO Business platform, focusing on environment variable management and secure secret generation.

## 1. Environment Variables and Secret Management

All sensitive information, such as API keys, database credentials, and JWT secrets, **must** be stored as environment variables and never hardcoded directly into the codebase.

### 1.1. `.env` Files

For local development, use `.env` files to manage your environment variables. These files should **never** be committed to version control. A `.env.example` file is provided to outline the required variables without exposing their values.

**Example `.env` file:**

```
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="file:./dev.db" # For local development with SQLite (PostgreSQL for production)
JWT_SECRET="your_super_secret_jwt_key_here"
JWT_EXPIRES_IN="7d"
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
TELEGRAM_ADMIN_CHANNEL="your_telegram_admin_channel_id"
USDT_TRC20_WALLET="your_usdt_trc20_wallet_address"
USDT_ERC20_WALLET="your_usdt_erc20_wallet_address"
TON_WALLET="your_ton_wallet_address"
RUB_TO_USDT_RATE=90
RUB_TO_TON_RATE=200
```

### 1.2. Generating Secure Secrets

For `JWT_SECRET` and other cryptographic keys, it is crucial to use strong, randomly generated strings. Avoid using easily guessable phrases or short strings.

**How to generate a strong `JWT_SECRET`:**

You can use various methods to generate a secure random string.

**Method 1: Using Node.js Crypto Module (Recommended)**

Open your terminal and run the following Node.js command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This command will output a 64-character hexadecimal string, which is suitable for use as a `JWT_SECRET`.

**Method 2: Using OpenSSL (Linux/macOS)**

If you have OpenSSL installed, you can generate a strong key with:

```bash
openssl rand -hex 32
```

This will also output a 64-character hexadecimal string.

**Method 3: Online Secret Generators (Use with Caution)**

There are online tools that can generate secure random strings. If you use one, ensure it's from a reputable source and copy the generated key directly into your `.env` file without exposing it.

**Important:**

- Always ensure your `JWT_SECRET` is at least 32 characters long for sufficient cryptographic strength.
- Never share your secrets.
- For production deployments, use your hosting provider's secure secret management features (e.g., Vercel Environment Variables, Railway Variables).

## 2. Other Security Considerations

- **Input Validation and Sanitization:** All user input must be validated and sanitized on the backend to prevent common vulnerabilities like XSS (Cross-Site Scripting) and SQL Injection. (Implemented via `backend/src/middleware/sanitization.ts` and `express-validator` schemas).
- **HTTPS Enforcement:** All communication should occur over HTTPS to protect data in transit. (Implemented via `backend/src/middleware/httpsRedirect.ts`).
- **Rate Limiting:** Implement rate limiting on API endpoints to prevent brute-force attacks and abuse. (Implemented via `express-rate-limit`).
- **Security Headers:** Utilize security headers (e.g., Content Security Policy, X-XSS-Protection) to mitigate various web vulnerabilities. (Implemented via Helmet.js).
- **CSRF Protection:** Implement CSRF (Cross-Site Request Forgery) protection for state-changing requests. (Implemented).
- **Dependency Security:** Regularly update and audit third-party dependencies for known vulnerabilities.
- **Error Handling:** Avoid exposing sensitive error details to clients. Log errors securely on the server.
- **Authentication:** Use strong, industry-standard authentication mechanisms (e.g., JWT with secure storage).
- **Authorization:** Implement granular authorization checks to ensure users only access resources they are permitted to.
