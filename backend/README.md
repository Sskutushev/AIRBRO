# AIRBRO Backend

Express + TypeScript backend for AIRBRO Business platform. Handles authentication, subscriptions, cart management, and crypto payments.

## Stack

- **Express 4** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Production database
- **JWT** - Authentication tokens
- **Winston** - Structured logging
- **Helmet** - Security headers
- **Express Rate Limit** - API protection

## Project Structure

```
backend/
├── src/
│   ├── config/            # Configuration (db, jwt, crypto wallets)
│   ├── controllers/       # Request handlers
│   │   ├── authController.ts      # Authentication logic
│   │   ├── cartController.ts      # Shopping cart operations
│   │   ├── paymentController.ts   # Payment processing
│   │   └── subscriptionController.ts
│   ├── middleware/        # Express middleware
│   │   ├── auth.ts        # JWT verification
│   │   ├── errorHandler.ts # Global error handler
│   │   ├── rateLimiter.ts  # Rate limiting
│   │   └── validation.ts   # Request validation
│   ├── routes/            # API routes definition
│   ├── services/          # Business logic layer
│   │   ├── authService.ts
│   │   ├── paymentService.ts
│   │   ├── subscriptionService.ts
│   │   └── telegramService.ts
│   ├── repositories/      # Database access layer
│   ├── utils/             # Helpers & utilities
│   │   ├── logger.ts      # Winston logger setup
│   │   ├── qrCodeGenerator.ts
│   │   └── validators.ts
│   └── server.ts          # Application entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Seed data
├── logs/                  # Application logs (gitignored)
└── tests/                 # Test files
```

## Key Concepts

### Layered Architecture

The backend follows a clean layered architecture:

**Routes → Controllers → Services → Repositories → Database**

- **Routes**: Define API endpoints and apply middleware
- **Controllers**: Parse requests, call services, format responses
- **Services**: Contain business logic, orchestrate data operations
- **Repositories**: Direct database access via Prisma
- **Models**: Prisma schema defines data structure

### Authentication Flow

1. User clicks "Login with Telegram" on frontend
2. Telegram widget redirects to backend `/api/auth/telegram`
3. Backend validates Telegram data hash
4. Creates/finds user in database
5. Generates JWT token with user ID and email
6. Frontend stores token in localStorage
7. Subsequent requests include `Authorization: Bearer <token>`

### Payment Flow

1. User adds products to cart
2. Checkout initiates payment via `/api/payments/create`
3. Backend generates crypto wallet address and QR code
4. User sends crypto to provided address
5. Backend monitors blockchain for transaction
6. On confirmation, creates subscription and marks payment complete

## API Structure

All endpoints are prefixed with `/api`:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/telegram` - Telegram authentication
- `GET /api/auth/me` - Get current user (requires auth)
- `GET /api/products` - List all products
- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart/add` - Add product to cart
- `DELETE /api/cart/remove/:productId` - Remove from cart
- `POST /api/payments/create` - Create payment
- `GET /api/payments/:id/status` - Check payment status
- `GET /api/subscriptions` - User's subscriptions
- `POST /api/subscriptions/cancel/:id` - Cancel subscription

See [API Documentation](../docs/API.md) for detailed endpoint specs.

## Database Models

### User
- Stores user credentials and profile
- Links to subscriptions, payments, cart

### Product
- Subscription plans (tier 1-3)
- Price, features, billing interval

### CartItem
- User's shopping cart entries
- Unique constraint on (userId, productId)

### Subscription
- Active user subscriptions
- Status: active, cancelled, expired, trial

### Payment
- Payment records with crypto details
- Status tracking: pending, completed, failed

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/airbro

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Telegram Bot
TELEGRAM_BOT_TOKEN=your:telegram:bot:token
TELEGRAM_BOT_USERNAME=your_bot_username

# Crypto Wallets (for payments)
USDT_TRC20_WALLET=your_trc20_wallet
USDT_ERC20_WALLET=your_erc20_wallet
TON_WALLET=your_ton_wallet

# Server
PORT=3001
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Redis (optional, for production rate limiting)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed

# Start dev server
npm run dev
```

Server runs on `http://localhost:3001`

### Database Commands

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database (caution!)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm test -- --watch

# UI mode (interactive)
npm run test:ui
```

Tests use Vitest with in-memory database. See [Testing Guide](../docs/TESTING.md).

## Logging

Winston logger writes to:
- **Console**: Formatted colored output (dev only)
- **logs/combined-YYYY-MM-DD.log**: All logs
- **logs/error-YYYY-MM-DD.log**: Errors only

Logs rotate daily and keep 14 days of history.

```bash
# View error logs
npm run logs:view-errors

# View all logs
npm run logs:view-all

# Cleanup old logs
npm run logs:cleanup
```

## Security Features

- **Helmet**: Sets security headers
- **CORS**: Configured for frontend origin
- **Rate Limiting**: Prevents abuse
- **JWT**: Secure token-based auth
- **CSRF Protection**: For state-changing operations
- **Input Validation**: Zod schemas on all endpoints
- **XSS Protection**: Sanitizes user inputs
- **Password Hashing**: bcrypt with salt rounds

## Production Considerations

1. **Use PostgreSQL**: SQLite is development-only
2. **Set Strong JWT_SECRET**: Use 32+ character random string
3. **Enable HTTPS**: Required for production
4. **Configure CORS**: Set specific frontend origin
5. **Use Redis**: For distributed rate limiting
6. **Monitor Logs**: Setup log aggregation (e.g., Sentry)
7. **Database Backups**: Regular automated backups
8. **Health Checks**: `/health` endpoint for monitoring

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

### Migration Errors
```bash
# Reset and re-migrate (development only!)
npm run prisma:migrate reset
npm run prisma:migrate
```

### Port Already in Use
```bash
# Find process on port 3001
netstat -ano | findstr :3001  # Windows
lsof -i :3001                  # Mac/Linux

# Kill the process or change PORT in .env
```

## Performance Tips

- **Connection Pooling**: Prisma handles this automatically
- **Indexing**: Database indexes on frequently queried fields
- **Caching**: Consider Redis for frequently accessed data
- **Async Operations**: Use async/await throughout
- **Lazy Loading**: Load related data only when needed

## Further Reading

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

For questions or issues, check the main [README](../README.md) or open an issue.
