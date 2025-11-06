# AIBRO Business Backend

Backend for AIBRO Business - AI-powered automation ecosystem for Telegram-native businesses.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- SQLite (for development) or PostgreSQL (for production)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Install Prisma:
```bash
npm install -g prisma
```

5. Set up database:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

6. Start the development server:
```bash
npm run dev
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get product by slug

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/:itemId` - Remove item from cart
- `POST /api/cart/clear` - Clear user's cart

### Payments
- `POST /api/payments/crypto/create` - Create crypto payment
- `GET /api/payments/:id/status` - Get payment status
- `POST /api/payments/:id/confirm` - Confirm payment (admin)
- `POST /api/payments/card/create` - Create card payment (not implemented)

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/subscriptions` - Get user subscriptions
- `GET /api/user/payments` - Get user payments
- `POST /api/user/subscriptions/:id/cancel` - Cancel subscription

## 🛠️ Tech Stack

- **Framework**: Express.js with TypeScript
- **Database**: SQLite (dev) / PostgreSQL (prod) with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Validation**: Zod
- **Payments**: Crypto payments with QR codes
- **Telegram**: Node Telegram Bot API

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── middleware/       # Auth, validation, error handling
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── services/         # Service layer
│   ├── models/           # TypeScript types
│   ├── utils/            # Utility functions
│   ├── prisma/           # Prisma schema and migrations
│   └── server.ts         # Entry point
```

## 🚨 Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Server
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Crypto Wallets
USDT_TRC20_WALLET=your_wallet_address
USDT_ERC20_WALLET=your_wallet_address
TON_WALLET=your_wallet_address

# Exchange Rates
RUB_TO_USDT_RATE=0.011
RUB_TO_TON_RATE=0.17

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHANNEL=your_channel_id
```

## 🧪 Development

Run in development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Run production build:
```bash
npm start
```

## 🚀 Deployment

This backend is designed to be easily deployable on platforms like Railway or Render:

1. Change `DATABASE_URL` to PostgreSQL connection string
2. Set environment variables
3. Deploy via Git push

## 📝 Notes

1. **Crypto Payments**: Currently using a manual confirmation system. Real blockchain verification would require additional API integrations.

2. **Payment Methods**: Card payments are not implemented yet (placeholder returning 501).

3. **Rate Limiting**: API has rate limiting middleware to prevent abuse.

4. **Security**: All sensitive endpoints are protected with JWT authentication.

## 🎯 Features Implemented

✅ User authentication (register, login, JWT)
✅ Product catalog management
✅ Shopping cart functionality
✅ Crypto payment processing (USDT TRC20/ERC20, TON)
✅ User profile management
✅ Subscription management
✅ Payment history
✅ Telegram notifications
✅ Input validation
✅ Error handling