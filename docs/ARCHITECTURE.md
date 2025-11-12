# Architecture Overview

This document describes the system architecture, design principles, and technical decisions behind AIRBRO Business platform.

## System Overview

AIRBRO is a full-stack SaaS platform with a clear separation between frontend and backend:

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │ ◄─────► │   Frontend   │ ◄─────► │   Backend   │
│             │  HTTPS  │  (Vercel)    │  REST   │  (Railway)  │
└─────────────┘         └──────────────┘         └─────────────┘
                                                         │
                                                         ▼
                                                  ┌─────────────┐
                                                  │ PostgreSQL  │
                                                  └─────────────┘
```

## Core Principles

### 1. Separation of Concerns
Each layer has a single responsibility:
- **Presentation**: React components handle UI only
- **State Management**: React Query manages server state, Context API for client state
- **Business Logic**: Backend services contain all business rules
- **Data Access**: Repositories and Prisma handle database operations

### 2. Type Safety
TypeScript throughout the stack ensures type safety:
- Shared types between frontend/backend (API contracts)
- Prisma generates types from database schema
- Zod validates runtime data against schemas

### 3. API-First Design
Backend exposes RESTful API that can be consumed by:
- Web frontend (current)
- Mobile apps (future)
- Third-party integrations
- Internal tools

### 4. Security by Default
Security is built into every layer:
- JWT authentication on all protected routes
- Rate limiting prevents abuse
- CSRF tokens for state changes
- Input validation on all endpoints
- Helmet sets security headers

## Frontend Architecture

### Component Structure

```
src/
├── pages/              # Route-level components
│   ├── Home.tsx        # Landing page
│   ├── Pricing.tsx     # Subscription tiers
│   ├── Cart.tsx        # Shopping cart
│   └── Dashboard.tsx   # User dashboard
├── components/         # Reusable UI components
│   ├── ui/             # Base components (Button, Input, Card)
│   ├── layout/         # Layout components (Header, Footer)
│   └── features/       # Feature-specific components
├── services/           # API client functions
│   ├── api.ts          # Axios instance with interceptors
│   ├── auth.ts         # Auth API calls
│   ├── cart.ts         # Cart API calls
│   └── payment.ts      # Payment API calls
├── context/            # React Context providers
│   ├── AuthContext.tsx # User authentication state
│   └── CartContext.tsx # Shopping cart state
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication logic
│   ├── useCart.ts      # Cart operations
│   └── useQuery.ts     # React Query wrappers
└── lib/                # Utilities
    ├── utils.ts        # Helper functions
    └── constants.ts    # App constants
```

### State Management Strategy

**Server State** (React Query):
- User data
- Products list
- Cart contents
- Subscriptions
- Payment status

Automatically handles caching, revalidation, and background updates.

**Client State** (Context API):
- Authentication token
- UI preferences (theme, language)
- Modal/drawer open state
- Form state (React Hook Form)

**URL State** (React Router):
- Current page
- Search/filter parameters
- Product/item IDs

### Data Flow

1. **Component mounts** → React Query triggers API call
2. **Loading state** → Shows skeleton/spinner
3. **Success** → Updates cache, re-renders component
4. **Error** → Shows toast notification, retries with exponential backoff
5. **User action** → Optimistic update, then API mutation
6. **Mutation success** → Invalidates related queries

### Routing

```
/                  # Home page (landing)
/pricing           # Subscription plans
/cart              # Shopping cart
/dashboard         # User dashboard (protected)
/subscriptions     # User subscriptions (protected)
/payments          # Payment history (protected)
/auth/callback     # OAuth callback handler
```

Protected routes use `PrivateRoute` wrapper that checks authentication.

## Backend Architecture

### Layered Architecture

```
Routes → Controllers → Services → Repositories → Database
  ↓          ↓           ↓            ↓
Routing   Parsing    Business      Data
          Response   Logic         Access
```

**Why this structure?**
- **Routes**: Define endpoints, apply middleware, keep routing logic separate
- **Controllers**: Parse requests, validate inputs, format responses
- **Services**: Contain business logic, can be tested in isolation
- **Repositories**: Abstract database access, makes switching DBs easier

### Module Structure

Each feature follows the same pattern:

```
src/
├── routes/
│   └── authRoutes.ts          # POST /api/auth/login, etc.
├── controllers/
│   └── authController.ts      # async login(req, res) { ... }
├── services/
│   └── authService.ts         # Business logic
└── repositories/
    └── userRepository.ts      # DB operations
```

### Request Lifecycle

```
1. Request arrives → Rate limiter checks
2. Route handler → Applies middleware (auth, validation)
3. Controller → Parses request body/params
4. Service → Executes business logic
5. Repository → Queries database via Prisma
6. Service → Processes results
7. Controller → Formats response
8. Middleware → Error handling
9. Response sent → Logger records
```

### Middleware Stack

Applied in this order:

1. **Helmet** - Security headers
2. **CORS** - Cross-origin rules
3. **Body Parser** - JSON/URL encoded
4. **Cookie Parser** - Cookies
5. **Rate Limiter** - Per-IP limits
6. **Logger** - Request logging
7. **Auth** - JWT verification (protected routes)
8. **Validation** - Zod schema validation
9. **Error Handler** - Catches all errors

## Database Schema

### Entity Relationships

```
User ──┬─→ CartItem ──→ Product
       ├─→ Subscription ──→ Product
       └─→ Payment
```

- **User** has many CartItems, Subscriptions, Payments
- **Product** has many CartItems, Subscriptions
- **Subscription** belongs to User and Product
- **Payment** belongs to User

### Key Design Decisions

**UUIDs as Primary Keys**: Better for distributed systems, no sequential guessing.

**Separate CartItem Table**: Allows quantity, prevents denormalization.

**Payment Status Tracking**: Enables async payment processing and retries.

**Soft Deletes** (via status): Subscriptions aren't deleted, just marked cancelled.

**Timestamps**: Every table has createdAt/updatedAt for auditing.

## Authentication System

### JWT Token Structure

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "iat": 1699999999,
  "exp": 1700604799
}
```

**Storage**: Frontend stores in `localStorage`, backend validates signature.

**Expiry**: 7 days default, refresh tokens not implemented (future enhancement).

### Telegram Authentication

Uses [Telegram Login Widget](https://core.telegram.org/widgets/login):

1. User clicks widget → Telegram app opens
2. User authorizes → Redirects to callback URL
3. Backend receives: `id`, `first_name`, `username`, `photo_url`, `auth_date`, `hash`
4. Backend validates hash using `TELEGRAM_BOT_TOKEN`
5. Creates/updates user in database
6. Returns JWT token to frontend

**Why Telegram?** Target audience uses Telegram, provides verified phone numbers.

## Payment System

### Crypto Payment Flow

1. User initiates payment → Backend creates Payment record with status "pending"
2. Backend generates wallet address (or uses static wallet)
3. QR code generated for wallet address
4. Frontend displays QR + address
5. User sends crypto → Transaction on blockchain
6. Backend polls blockchain API for confirmation (future: webhooks)
7. Transaction confirmed → Payment status → "completed"
8. Create Subscription record with "active" status

**Current Implementation**: Static wallets (manual verification).

**Future**: Dynamic address generation per payment for automated tracking.

## Error Handling

### Error Types

**Validation Errors (400)**:
```json
{ "error": "Validation failed", "details": [...] }
```

**Authentication Errors (401)**:
```json
{ "error": "Unauthorized", "message": "Invalid token" }
```

**Not Found Errors (404)**:
```json
{ "error": "Not found", "message": "Resource not found" }
```

**Server Errors (500)**:
```json
{ "error": "Internal server error", "message": "..." }
```

### Error Propagation

1. Error occurs in repository/service
2. Throw custom error with status code
3. Global error handler catches
4. Logs error with Winston
5. Sends appropriate response
6. Frontend displays toast notification

## Logging Strategy

### Log Levels

- **error**: Exceptions, failed operations
- **warn**: Deprecated features, slow queries
- **info**: Startup, shutdown, key actions
- **debug**: Detailed flow information
- **verbose**: Everything (dev only)

### Log Structure

```json
{
  "timestamp": "2024-11-12T12:34:56.789Z",
  "level": "info",
  "message": "User logged in",
  "userId": "uuid",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

Structured logs enable easy parsing for monitoring tools.

## Performance Considerations

### Frontend Optimizations

- **Code Splitting**: Lazy load routes with React.lazy
- **Image Optimization**: WebP format, responsive images
- **Bundle Size**: Tree-shaking, no lodash (use specific imports)
- **Caching**: Service worker caches static assets
- **Debouncing**: Search inputs debounced 300ms

### Backend Optimizations

- **Database Indexing**: Indexes on frequently queried columns
- **Connection Pooling**: Prisma maintains connection pool
- **Response Compression**: Gzip middleware
- **Query Optimization**: Select only needed fields
- **Rate Limiting**: Prevents abuse, reduces load

### Database Optimization

```prisma
// Indexed fields
@@unique([email])
@@unique([telegram])
@@index([userId, status])  // For user subscriptions query
```

## Scalability Approach

### Current State (MVP)
- Single backend instance
- PostgreSQL database
- No caching layer
- Manual payment verification

### Future Enhancements

**Horizontal Scaling**:
- Multiple backend instances behind load balancer
- Redis for session storage
- Redis for rate limiting across instances

**Caching**:
- Redis cache for products list
- CDN for frontend assets
- HTTP cache headers

**Async Processing**:
- Bull queue for payment verification
- Cron jobs for subscription renewals
- Email queue for notifications

**Monitoring**:
- Sentry for error tracking
- Datadog/New Relic for APM
- Custom metrics dashboard

## Technology Choices

### Why React?
- Large ecosystem, mature tooling
- Great TypeScript support
- Framer Motion for smooth animations
- React Query simplifies async state

### Why Express?
- Minimal, flexible
- Massive middleware ecosystem
- Easy to test
- Well-documented

### Why Prisma?
- Type-safe database client
- Automatic migrations
- Great developer experience
- Supports multiple databases

### Why PostgreSQL?
- Robust, production-ready
- ACID compliance
- JSON support for flexible fields
- Excellent performance

### Why Vite?
- Instant HMR
- Fast builds with esbuild
- Better than webpack for modern projects
- Great TypeScript support

## Security Architecture

See [SECURITY.md](SECURITY.md) for detailed security practices.

**Key Points**:
- All sensitive data encrypted at rest
- JWT tokens signed and verified
- Rate limiting per endpoint
- HTTPS enforced in production
- Regular dependency updates

## Deployment Architecture

```
GitHub → GitHub Actions CI/CD
   ↓
   ├─→ Vercel (Frontend)
   │      └─→ CDN (static assets)
   └─→ Railway (Backend)
          └─→ PostgreSQL
```

**Why Vercel?** 
- Zero-config deployments
- Global CDN
- Automatic HTTPS
- Preview deployments for PRs

**Why Railway?**
- Easy PostgreSQL provisioning
- Simple environment variables
- Auto-deploys from GitHub
- Affordable for MVP

## Future Architecture Considerations

1. **Microservices**: Split into auth, payment, subscription services
2. **GraphQL**: Consider GraphQL for flexible querying
3. **WebSockets**: Real-time payment status updates
4. **Mobile Apps**: React Native reuses business logic
5. **Analytics**: Add Mixpanel/Amplitude for user insights

---

This architecture supports rapid iteration while maintaining clean separation of concerns. As we scale, we can extract services, add caching layers, and optimize bottlenecks without major refactoring.
