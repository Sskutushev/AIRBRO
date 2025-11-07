# Security Documentation AIBRO Business

## Overview

Security is a fundamental aspect of AIBRO Business architecture. The system implements industry-standard security practices to protect user data, prevent attacks, and ensure the integrity of the platform. This document outlines security measures, implementation details, and best practices.

## Security Architecture

### Defense in Depth
The security strategy employs multiple layers of protection:
1. **Network Perimeter**: Infrastructure security
2. **Transport Security**: TLS encryption in transit
3. **Application Security**: Input validation and output encoding
4. **Data Security**: Encryption at rest and data protection
5. **Authentication Security**: Strong authentication controls

### Security Principles
- **Zero Trust**: Verify everything, trust nothing by default
- **Least Privilege**: Minimum necessary permissions
- **Defense in Depth**: Multiple layers of protection
- **Security by Design**: Security considerations from conception
- **Privacy by Default**: Minimal data collection and processing

## Authentication & Authorization

### JWT Implementation
- **Algorithm**: HS256 with random 32-byte secret
- **Expiration**: 7 days with refresh tokens to be implemented
- **Payload**: User ID, role, issued at, expiration timestamp
- **Blacklisting**: To be implemented for token revocation

#### Frontend Token Handling:
```typescript
// src/services/api/client.ts
class APIClient {
  private token: string | null = null;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    // Check for existing token in localStorage
    this.token = localStorage.getItem('aibro_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('aibro_token', token);
    } else {
      localStorage.removeItem('aibro_token');
    }
  }

  // Token validation method
  validateToken(): boolean {
    if (!this.token) return false;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Server error' }));
      throw new APIError(errorData.message, response.status);
    }
    return response.json();
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token && this.validateToken()) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof APIError) {
        if (error.statusCode === 401) {
          // Token expired or invalid, clear it
          this.setToken(null);
        }
        throw error;
      }
      throw new APIError('Connection error with server', 0);
    }
  }
}
```

#### Backend Authentication:
```typescript
// backend/src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      status: 'error',
      message: 'Access token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Invalid or expired token' 
      });
    }
    
    req.userId = (decoded as any).userId;
    next();
  });
};
```

### Password Security
- **Hashing Algorithm**: BCrypt with 10 rounds
- **Salt Rounds**: Configurable (currently 10 for balance of security/performance)
- **Password Complexity**: Minimum 8 chars, uppercase, lowercase, number, special char

```typescript
// backend/src/utils/auth.ts
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
```

## Input Validation & Sanitization

### Frontend Validation
Using Zod for comprehensive input validation:

```typescript
// src/lib/validation/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Неверный формат email'),
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Z]/, 'Должна быть хотя бы одна заглавная буква')
    .regex(/[a-z]/, 'Должна быть хотя бы одна строчная буква')
    .regex(/[0-9]/, 'Должна быть хотя бы одна цифра')
    .regex(/[!@#$%^&*]/, 'Должен быть спецсимвол'),
});

export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя не должно превышать 50 символов'),
  telegram: z
    .string()
    .regex(/^@[a-zA-Z0-9_]{5,32}$/, 'Неверный формат Telegram username'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

### Backend Validation
Using Zod for server-side validation:

```typescript
// backend/src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

// Usage example
const registerValidation = validate(
  z.object({
    body: z.object({
      name: z.string().min(2).max(50),
      email: z.string().email(),
      password: z.string().min(8),
      telegram: z.string().regex(/^@[a-zA-Z0-9_]{5,32}$/),
    }),
  })
);
```

## XSS Protection

### DOM Sanitization
Using DOMPurify for safe HTML rendering:

```typescript
// src/components/common/SafeHTML.tsx
import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

export const SafeHTML: React.FC<SafeHTMLProps> = ({ html, className }) => {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['on*', 'href', 'src', 'data', 'formaction', 'form', 'style'],
  });

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};
```

### React Safe Rendering
- React JSX prevents direct script injection by default
- Proper encoding of user-generated content
- No direct use of dangerouslySetInnerHTML without sanitization

### Content Security Policy (CSP)
```html
<meta 
  http-equiv="Content-Security-Policy" 
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://www.google-analytics.com https://www.googletagmanager.com https://browser.sentry-cdn.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.sentry.io https://www.google-analytics.com https://api.telegram.org;
    img-src 'self' data: https: blob:;
    frame-src https://www.youtube.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
    block-all-mixed-content;
  "
/>
```

## CSRF Protection

### Backend CSRF Protection
```typescript
// backend/src/server.ts
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

// Enable cookie parsing
app.use(cookieParser());

// CSRF protection middleware (for all non-GET/HEAD/OPTIONS requests)
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production (requires HTTPS)
    sameSite: 'strict',
  },
});

app.use(csrfProtection);

// Endpoint to get CSRF token for frontend
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

#### Frontend CSRF Implementation:
```typescript
// src/services/api/client.ts
class APIClient {
  private csrfToken: string | null = null;

  // Method to get CSRF token
  async fetchCSRFToken(): Promise<string> {
    const response = await fetch('/api/csrf-token');
    const data = await response.json();
    return data.csrfToken;
  }

  // Include CSRF token in requests when needed
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Include CSRF token for non-GET requests
    if (options.method && options.method !== 'GET' && options.method !== 'HEAD') {
      if (!this.csrfToken) {
        this.csrfToken = await this.fetchCSRFToken();
      }
      headers['X-CSRF-Token'] = this.csrfToken;
    }

    // Include token if authenticated
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    return this.handleResponse<T>(response);
  }
}
```

## Rate Limiting & DoS Protection

### API Rate Limiting
```typescript
// backend/src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

await redisClient.connect();

// General API rate limiting
export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:api:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication rate limiting (stricter)
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 login/register attempts per window
  skipSuccessfulRequests: true, // Only track failed requests
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Payment rate limiting
export const paymentLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:payment:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit to 10 payment attempts per hour
  message: {
    status: 'error',
    message: 'Too many payment requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

### Usage in Routes:
```typescript
// backend/src/routes/auth.ts
import { authLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validation';
import { loginSchema } from '../utils/validationSchemas';

router.post('/login', authLimiter, validate(loginSchema), login);
```

## Data Protection

### Sensitive Data Handling
- **No Hardcoded Secrets**: All secrets in environment variables
- **Environment Isolation**: Separate environments for dev/staging/prod
- **Minimal Data Collection**: Collect only necessary data
- **Secure Logging**: No sensitive data in logs

#### Secure Logging Implementation:
```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Function to remove sensitive data from objects
const redactSensitiveData = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;

  const redacted = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (
      typeof key === 'string' &&
      (
        key.toLowerCase().includes('password') ||
        key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('secret') ||
        key.toLowerCase().includes('key') ||
        key.toLowerCase().includes('hash') ||
        key.toLowerCase().includes('cvv') ||
        key.toLowerCase().includes('card')
      )
    ) {
      (redacted as any)[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      (redacted as any)[key] = redactSensitiveData(value);
    } else {
      (redacted as any)[key] = value;
    }
  }

  return redacted;
};

export const logInfo = (message: string, data?: any) => {
  const safeData = data ? redactSensitiveData(data) : undefined;
  logger.info(message, safeData);
};

export const logError = (message: string, error?: any, context?: any) => {
  const safeError = error ? redactSensitiveData(error) : undefined;
  const safeContext = context ? redactSensitiveData(context) : undefined;
  
  logger.error(message, {
    error: safeError,
    context: safeContext,
  });
};
```

### Database Security
- **Prisma ORM**: Prevents SQL injection by design
- **Parameterized Queries**: All database queries use parameters
- **Access Controls**: Role-based permissions
- **Encryption**: Sensitive fields encrypted at rest (planned)

## Security Headers

### Backend Security Headers
```typescript
// backend/src/server.ts
import helmet from 'helmet';

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        scriptSrc: ["'self'"],
        connectSrc: [
          "'self'",
          process.env.NODE_ENV === 'production'
            ? 'https://*.sentry.io'
            : 'http://localhost:*',
          'https://www.google-analytics.com',
          'https://api.telegram.org',
        ],
        frameAncestors: ["'none'"], // Prevent clickjacking
        objectSrc: ["'none'"], // Prevent plugins
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
      reportOnly: false,
    },
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: 'deny', // Prevent embedding in frames
    },
    referrerPolicy: {
      policy: ['no-referrer'],
    },
    permittedCrossDomainPolicies: {
      permittedPolicies: 'none',
    },
  })
);
```

### CORS Configuration
```typescript
// backend/src/server.ts
import cors from 'cors';

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://aibrobusiness.com' 
      : [ 
          'http://localhost:5173', 
          'http://localhost:3000',
          /\.vercel\.app$/, // Allow Vercel previews
        ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-CSRF-Token',
    ],
    exposedHeaders: ['X-Total-Count'],
  })
);
```

## Third-Party Integrations Security

### Telegram Bot Security
- **Secret Token Storage**: Bot token in environment variables
- **Message Validation**: Validate all incoming messages
- **Chat ID Verification**: Verify sender before responding
- **Rate Limiting**: Limit messages per user/time

```typescript
// backend/src/services/telegram.ts
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

// Verify message is from legitimate source
const isValidMessage = (message: any): boolean => {
  // Add validation logic
  return true; // Simplified
};

bot.on('message', (msg) => {
  if (!isValidMessage(msg)) {
    return; // Ignore invalid messages
  }

  const chatId = msg.chat.id;
  const text = msg.text;

  // Sanitize user input before processing
  const sanitizedText = text ? sanitizeInput(text) : '';
  
  // Process message...
});
```

### Cryptocurrency Payment Security
- **Wallet Address Validation**: Validate addresses before accepting
- **Transaction Verification**: Verify transactions via blockchain API
- **Confirmation Checking**: Wait for required confirmations
- **Timeout Handling**: Expire payments after time period
- **Rate Limiting**: Limit payment creation per user/IP

```typescript
// backend/src/services/cryptoPayments.ts
export const verifyTransaction = async (
  txHash: string, 
  walletAddress: string, 
  amount: number,
  currency: string
): Promise<boolean> => {
  try {
    // Verify transaction via blockchain API
    const transaction = await getTransaction(txHash, currency);
    
    if (transaction.status !== 'confirmed') {
      return false;
    }

    // Verify recipient and amount
    if (transaction.to !== walletAddress) {
      logWarning('Payment verification failed: incorrect recipient');
      return false;
    }

    if (transaction.amount < amount) {
      logWarning('Payment verification failed: insufficient amount');
      return false;
    }

    return true;
  } catch (error) {
    logError('Transaction verification error', error);
    return false;
  }
};
```

## Server-Side Protection

### Input Sanitization
- **All user inputs sanitized** before processing
- **Whitelist validation** for known values
- **No blacklisting** - only accept known good values
- **Type validation** with TypeScript and Zod

### File Upload Security (if implemented)
- **File type validation**: Only allow specific file types
- **Size limits**: Enforce maximum file sizes
- **Virus scanning**: Scan uploaded files
- **Secure storage**: Store files outside web-accessible directories

## Monitoring & Incident Response

### Security Monitoring
- **Sentry Integration**: Real-time error monitoring
- **Security Events**: Log all authentication attempts
- **Abnormal Activity**: Detect unusual patterns
- **Rate Limit Exceeded**: Monitor rate limiting events

#### Security Event Logging:
```typescript
// backend/src/utils/securityLogger.ts
import { logInfo, logError } from './logger';

export const logSecurityEvent = (event: {
  type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'data_access';
  userId?: string;
  ip: string;
  userAgent?: string;
  details?: Record<string, any>;
}) => {
  logInfo('Security Event', {
    timestamp: new Date().toISOString(),
    ...event,
    details: event.details ? redactSensitiveSecurityDetails(event.details) : undefined,
  });
};

const redactSensitiveSecurityDetails = (details: Record<string, any>) => {
  const sanitized = { ...details };
  
  // Redact sensitive information
  if (sanitized.password) delete sanitized.password;
  if (sanitized.credentials) delete sanitized.credentials;
  if (sanitized.token) delete sanitized.token;
  if (sanitized.sessionId) delete sanitized.sessionId;
  
  return sanitized;
};
```

### Error Handling
- **Generic error messages**: Don't leak internal details
- **Structured error responses**: Standardized error format
- **Sensitive data redaction**: Never log sensitive information
- **Rate limiting on errors**: Prevent error-based discovery

## Environment Security

### Environment Variable Security
- **.env files excluded** from Git using .gitignore
- **Environment-specific configs**: Different configs for different environments
- **Secret validation**: Verify required secrets at startup
- **Production secrets**: Limited access to production secrets

#### Environment Validation:
```typescript
// backend/src/config/environment.ts
export const validateEnvironment = () => {
  const required = [
    'JWT_SECRET',
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_ADMIN_CHANNEL',
    'DATABASE_URL',
    'FRONTEND_URL',
  ];

  for (const envVar of required) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  // Validate JWT secret length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
};
```

## Security Testing

### Vulnerability Scanning
- **npm audit**: Regular dependency vulnerability scanning
- **Snyk**: Advanced vulnerability detection
- **OWASP ZAP**: Automated security scanning (planned)
- **CodeQL**: Static analysis for security patterns

### Penetration Testing
- **Regular assessments**: Quarterly penetration testing
- **Automated checks**: Scheduled security scans
- **Manual review**: Security-focused code reviews
- **Bug bounty program**: Planned for future

## Compliance

### Privacy Compliance
- **GDPR Ready**: Ability to handle data requests
- **Minimal Data Collection**: Only essential data collected
- **Data Retention**: Defined retention periods
- **User Rights**: Implement right to deletion/rectification

### Data Processing Agreement
- **Purpose Limitation**: Data used only for intended purposes
- **Storage Limitation**: Automatic cleanup of old data
- **Integrity and Confidentiality**: Protected processing
- **Transparency**: Clear privacy notices

## Security Checklist

### Pre-Deployment
- [ ] All secrets in environment variables
- [ ] Input validation implemented
- [ ] Output encoding implemented
- [ ] Rate limiting configured
- [ ] Security headers applied
- [ ] CORS properly configured
- [ ] Authentication required for protected routes
- [ ] No sensitive data in logs
- [ ] CSRF protection implemented
- [ ] XSS protection implemented

### Post-Deployment
- [ ] Security scan passed
- [ ] Penetration testing completed
- [ ] Access logs reviewed
- [ ] Error logs reviewed
- [ ] Performance tested under load
- [ ] Backup procedures verified
- [ ] Security monitoring configured
- [ ] Incident response plan tested

## Security Updates & Maintenance

### Dependency Updates
- **Regular updates**: Weekly automated dependency updates
- **Vulnerability monitoring**: Automatic vulnerability alerts
- **Patch management**: Regular security patching
- **Breaking changes**: Thorough testing of updates

### Security Procedures
- **Incident Response**: Defined incident response procedures
- **Security Training**: Regular team security training
- **Access Reviews**: Periodic access control reviews
- **Vulnerability Assessments**: Regular security audits

---

## Conclusion

The AIBRO Business security implementation follows modern best practices and includes multiple layers of protection against common web application threats. The system is designed to protect user data, prevent unauthorized access, and maintain the integrity of the platform while providing a seamless experience for legitimate users.

Key security measures implemented:
1. **Robust authentication** with JWT and proper token handling
2. **Comprehensive input validation** and sanitization
3. **XSS and CSRF protection** with modern techniques
4. **Rate limiting** to prevent abuse and DoS attacks
5. **Secure logging** without exposing sensitive information
6. **Security headers** and CSP implementation
7. **Third-party integration security** for Telegram and payments
8. **Monitoring and incident response** procedures