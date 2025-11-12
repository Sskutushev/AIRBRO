# Security Guide

Security practices and considerations for AIRBRO Business platform.

## Security Principles

1. **Defense in Depth** - Multiple security layers
2. **Least Privilege** - Minimal access by default
3. **Fail Secure** - Errors deny access, not grant
4. **Secure by Default** - Security enabled out of the box
5. **Regular Updates** - Keep dependencies current

## Authentication & Authorization

### JWT Tokens

**Implementation**:
- Tokens signed with `JWT_SECRET` (256-bit minimum)
- 7-day expiration (configurable)
- Payload includes: `userId`, `email`, `iat`, `exp`
- Verified on every protected route

**Best Practices**:
```typescript
// Strong secret generation
const JWT_SECRET = crypto.randomBytes(64).toString('hex');

// Token verification with error handling
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
};
```

**Token Storage**:
- Frontend: `localStorage` (XSS risk mitigated by CSP)
- Never in URL parameters
- Never in cookies without HttpOnly flag

**Refresh Tokens** (Future):
Current implementation uses single token. Consider adding refresh tokens for:
- Shorter access token lifetime (15 min)
- Long-lived refresh token (30 days)
- Rotation on use

### Password Security

**Hashing**:
```typescript
import bcrypt from 'bcrypt';

// Hash password with 10 salt rounds
const hash = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, hash);
```

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (recommended)

**Validation**:
```typescript
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number');
```

### Telegram Authentication

**Validation Process**:
1. Receive auth data from Telegram widget
2. Verify `auth_date` is recent (< 24 hours)
3. Calculate hash using bot token
4. Compare with received hash
5. Reject if mismatch

**Implementation**:
```typescript
const validateTelegramAuth = (data: TelegramAuthData) => {
  const { hash, ...authData } = data;
  
  // Check auth_date
  const authDate = parseInt(authData.auth_date);
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > 86400) {
    throw new Error('Auth data expired');
  }
  
  // Create data check string
  const dataCheckString = Object.keys(authData)
    .sort()
    .map(key => `${key}=${authData[key]}`)
    .join('\n');
  
  // Calculate hash
  const secretKey = crypto
    .createHash('sha256')
    .update(TELEGRAM_BOT_TOKEN)
    .digest();
  
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  // Compare
  if (calculatedHash !== hash) {
    throw new Error('Invalid hash');
  }
};
```

## Input Validation

### Request Validation

**All inputs validated with Zod**:
```typescript
// Route handler
app.post('/api/auth/register', validate(registerSchema), async (req, res) => {
  // req.body is type-safe and validated
});

// Schema
const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2).max(50),
    telegram: z.string().regex(/^@[a-zA-Z0-9_]{5,32}$/),
  }),
});
```

**Validation Middleware**:
```typescript
const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
  };
};
```

### XSS Prevention

**Output Encoding**:
```typescript
// Frontend: DOMPurify for user-generated content
import DOMPurify from 'dompurify';

const sanitize = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
  });
};
```

**Backend**: Never render user input directly in HTML.

**Content Security Policy**:
```typescript
// helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.airbro.com'],
    },
  },
}));
```

### SQL Injection Prevention

**Prisma ORM** prevents SQL injection by default:
```typescript
// Safe - parameterized query
await prisma.user.findUnique({
  where: { email: userInput }
});

// Never do this (raw SQL)
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userInput}`;
// Use $queryRawUnsafe only with validated inputs
```

## Rate Limiting

### Implementation

**Express Rate Limit**:
```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
});

app.use('/api/auth/login', authLimiter);
```

**Redis-based Rate Limiting** (Production):
```typescript
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

const limiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
});
```

### DDoS Protection

**Cloudflare** (Recommended):
- Automatic DDoS mitigation
- Rate limiting at edge
- Bot detection

**Railway/Vercel**:
- Built-in DDoS protection
- Automatic scaling

## HTTPS & Transport Security

### Enforce HTTPS

**Vercel/Railway**: Automatic HTTPS, redirects HTTP to HTTPS.

**HSTS Header**:
```typescript
app.use(helmet({
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));
```

### Secure Cookies

```typescript
res.cookie('token', jwt, {
  httpOnly: true,      // Not accessible via JavaScript
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

## CORS Configuration

**Strict CORS Policy**:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

**Never use**:
```typescript
// Bad - allows any origin
app.use(cors({ origin: '*' }));
```

## CSRF Protection

**CSRF Tokens** (for cookie-based auth):
```typescript
import csurf from 'csurf';

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  },
});

// Apply to state-changing routes
app.post('/api/cart/add', csrfProtection, cartController.add);

// Frontend: Include token in requests
<input type="hidden" name="_csrf" value={csrfToken} />
```

**Current Implementation**: Uses JWT in Authorization header, less CSRF risk.

## Database Security

### Connection Security

**SSL Connection**:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

**Environment Variables**: Never commit credentials to Git.

### Query Security

**Parameterized Queries**: Prisma handles this automatically.

**Least Privilege**: Database user has only necessary permissions:
```sql
-- Create limited user
CREATE USER airbro_app WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO airbro_app;
-- No DROP, CREATE TABLE, etc.
```

### Sensitive Data

**Encryption at Rest**:
- Railway/Vercel: Encrypted storage by default
- Passwords: bcrypt hashed (never plaintext)
- Payment data: Minimal storage, no card details

**Data Minimization**: Store only necessary data.

## Secrets Management

### Environment Variables

**Never commit**:
```
.env
.env.local
.env.production
```

**Secret Rotation**:
```bash
# Generate new JWT secret
openssl rand -base64 64

# Update in Railway/Vercel
railway variables set JWT_SECRET=new_secret

# Invalidates all existing tokens
```

### API Keys

**Storage**:
- Development: `.env` (gitignored)
- Production: Vercel/Railway environment variables

**Rotation**: Rotate keys quarterly or after breach.

## Logging & Monitoring

### Secure Logging

**Never log**:
- Passwords (even hashed)
- JWT tokens
- API keys
- Payment details

**Safe logging**:
```typescript
logger.info('User logged in', {
  userId: user.id,
  email: user.email, // OK
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  // password: req.body.password // NEVER
});
```

### Error Handling

**Production**: Hide implementation details.
```typescript
app.use((err, req, res, next) => {
  logger.error('Error', { error: err, stack: err.stack });
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error'
      : err.message,
  });
});
```

### Monitoring

**Sentry** for error tracking:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  beforeSend(event, hint) {
    // Scrub sensitive data
    if (event.request?.headers) {
      delete event.request.headers.authorization;
    }
    return event;
  },
});
```

## Dependency Security

### Audit Dependencies

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check in CI
npm audit --audit-level=moderate
```

### Dependency Updates

**Automated** (Dependabot):
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
    open-pull-requests-limit: 10
```

**Manual review**: Don't auto-merge major version updates.

## Security Headers

**Helmet.js** sets secure headers:
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
  frameguard: { action: 'deny' }, // Prevent clickjacking
  noSniff: true, // Prevent MIME sniffing
  xssFilter: true, // XSS protection
}));
```

**Additional Headers**:
```typescript
// Referrer Policy
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

## Crypto Payment Security

### Wallet Security

**Static Wallets**: Monitor for incoming transactions.

**Dynamic Wallets** (Future):
- Generate unique address per payment
- Reduces manual verification
- Better user privacy

### Transaction Verification

```typescript
const verifyPayment = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });
  
  // Call blockchain API
  const tx = await blockchainApi.getTransaction(payment.walletAddress);
  
  // Verify amount and confirmations
  if (tx.amount >= payment.amount && tx.confirmations >= 3) {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'completed',
        txHash: tx.hash,
      },
    });
  }
};
```

## Incident Response

### Security Breach Checklist

1. **Detect**: Monitor logs, Sentry alerts
2. **Contain**: Revoke compromised keys/tokens
3. **Investigate**: Review logs, identify scope
4. **Notify**: Inform affected users (GDPR requirement)
5. **Remediate**: Fix vulnerability, deploy patch
6. **Post-Mortem**: Document incident, improve process

### Emergency Contacts

- **Backend Issues**: Railway support
- **Frontend Issues**: Vercel support
- **Database**: Railway PostgreSQL support

### Rollback Plan

```bash
# Immediate rollback
vercel rollback  # Frontend
railway rollback # Backend

# Rotate secrets
railway variables set JWT_SECRET=new_secret
# Update in .env, redeploy
```

## Compliance

### GDPR (EU Users)

**Data Subject Rights**:
- **Right to Access**: Users can export their data
- **Right to Deletion**: Delete account endpoint
- **Right to Rectification**: Update profile endpoint

**Implementation**:
```typescript
// Export user data
app.get('/api/users/export', auth, async (req, res) => {
  const data = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      subscriptions: true,
      payments: true,
    },
  });
  
  res.json(data);
});

// Delete account
app.delete('/api/users/me', auth, async (req, res) => {
  await prisma.user.delete({
    where: { id: req.user.id },
    // Cascade deletes subscriptions, payments
  });
  
  res.status(204).send();
});
```

**Privacy Policy**: Required, link in footer.

## Security Checklist

### Development
- [ ] No secrets in code
- [ ] Input validation on all endpoints
- [ ] Error handling doesn't leak info
- [ ] Dependencies up to date
- [ ] Tests include security scenarios

### Deployment
- [ ] HTTPS enforced
- [ ] Strong JWT secret (64+ chars)
- [ ] CORS configured for specific origin
- [ ] Rate limiting enabled
- [ ] Security headers set (Helmet)
- [ ] Database credentials secure
- [ ] Environment variables set correctly
- [ ] Logs don't contain sensitive data

### Ongoing
- [ ] Weekly dependency audits
- [ ] Quarterly secret rotation
- [ ] Monthly security reviews
- [ ] Incident response plan documented
- [ ] Security patches applied promptly

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Guide](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

Security is an ongoing process. Stay informed, update regularly, and follow best practices.
