# AIRBRO Business

Modern AI-powered automation ecosystem for Telegram-native businesses. Full-stack platform with subscription management, crypto payments, and seamless user experience.

## What's This

AIRBRO is a production-ready SaaS platform that combines a sleek landing page with a robust backend. Users can browse subscription plans, authenticate via Telegram, manage their cart, and pay with cryptocurrency (USDT/TON).

**Live:** [airbro-business.vercel.app](https://airbro-business.vercel.app)

## Tech Stack

### Frontend
- **React 19** + **TypeScript** - Type-safe UI components
- **Vite** - Lightning-fast builds
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Query** - Server state management
- **React Hook Form + Zod** - Form validation
- **i18next** - Multi-language support (EN/RU)

### Backend
- **Express** + **TypeScript** - API server
- **Prisma** + **PostgreSQL** - Type-safe database ORM
- **JWT** - Secure authentication
- **Winston** - Structured logging
- **Helmet + CORS** - Security middleware

### Testing & Quality
- **Vitest** - Fast unit/integration tests
- **Playwright** - End-to-end testing
- **ESLint + Prettier** - Code quality
- **Husky** - Git hooks

### Infrastructure
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **GitHub Actions** - CI/CD pipeline

## Quick Start

```bash
# Clone the repo
git clone https://github.com/Sskutushev/AIRBRO-Business.git
cd AIRBRO-Business

# Install dependencies
npm install
cd backend && npm install && cd ..

# Setup environment
cp .env.example .env
cp backend/.env.example backend/.env
# Edit .env files with your credentials

# Run database migrations
cd backend && npm run prisma:migrate && cd ..

# Start development
npm run dev              # Frontend on :5173
cd backend && npm run dev  # Backend on :3001
```

## Project Structure

```
AIRBRO/
├── src/                    # Frontend application
│   ├── components/         # React components
│   ├── pages/             # Route pages
│   ├── services/          # API clients
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities & helpers
│   └── types/             # TypeScript types
├── backend/               # Backend API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   └── config/        # Configuration
│   └── prisma/            # Database schema & migrations
├── e2e/                   # Playwright tests
├── .github/workflows/     # CI/CD pipelines
└── docs/                  # Detailed documentation
```

## Features

- **Multi-tier Subscriptions** - Three pricing tiers with feature comparison
- **Telegram Auth** - One-click authentication via Telegram
- **Crypto Payments** - USDT (TRC20/ERC20) and TON support
- **Shopping Cart** - Add/remove products, checkout flow
- **User Dashboard** - View subscriptions, payment history
- **i18n Support** - English and Russian languages
- **Responsive Design** - Mobile-first approach
- **Rate Limiting** - API protection
- **CSRF Protection** - Secure forms
- **Structured Logging** - Winston with daily rotation

## Scripts

### Frontend
```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
npm run lint             # Lint code
npm run format           # Format with Prettier
```

### Backend
```bash
npm run dev              # Start dev server
npm run build            # Compile TypeScript
npm run test             # Run tests
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
```

## Environment Variables

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_TELEGRAM_BOT_USERNAME=your_bot
VITE_SENTRY_DSN=your_sentry_dsn
```

### Backend `.env`
```env
DATABASE_URL=postgresql://user:password@localhost:5432/airbro
JWT_SECRET=your_jwt_secret
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

See `.env.example` files for complete configuration options.

## Documentation

- [Architecture](docs/ARCHITECTURE.md) - System design and folder structure
- [API Reference](docs/API.md) - Backend endpoints and schemas
- [Testing Guide](docs/TESTING.md) - Unit, integration, and E2E tests
- [Deployment](docs/DEPLOYMENT.md) - Production deployment steps
- [CI/CD](docs/CI_CD.md) - GitHub Actions workflows
- [Security](docs/SECURITY.md) - Security practices and considerations
- [SEO](docs/SEO.md) - Search engine optimization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues:** [GitHub Issues](https://github.com/Sskutushev/AIRBRO-Business/issues)
- **Telegram:** Contact via bot

---

Built with ❤️ by AIRBRO Business Team
