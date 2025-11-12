// Now, validate and import other modules
import './config/environment'; // This validates env variables
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
// Note: Helmet.js should be installed for security: npm install helmet
import helmet from 'helmet';
// import { csrfProtection, csrfTokenHandler } from './middleware/csrf'; // CSRF disabled for now
import { httpsRedirect } from './middleware/httpsRedirect';
import { sanitizeInput } from './middleware/sanitization';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import paymentRoutes from './routes/payments';
import userRoutes from './routes/user';
// import telegramRoutes from './routes/telegram';
import logger from './utils/logger';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Add body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security middleware - MUST be before CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
})); // Activate Helmet.js for security headers

// CORS configuration - MUST be before routes
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://airbro-mrqs.vercel.app',
      'https://airbro.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:4173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200,
  })
);

// HTTPS redirect - MUST be after CORS
app.use(httpsRedirect); // Apply HTTPS redirect for production
app.use(sanitizeInput); // Apply input sanitization to prevent XSS

// Different rate limits for different routes
// General rate limiter (for all routes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // More generous limit for development
  message: 'Too many requests from this IP, please try again later.',
});

// Strict rate limiter for authentication routes (to prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 100, // Much higher limit for development
  message: 'Too many authentication attempts from this IP, please try again later.',
});

// Apply rate limiting only in production or if explicitly enabled
if (process.env.NODE_ENV === 'production') {
  app.use(generalLimiter);
  app.use('/api/auth', authLimiter);
  logger.info('Rate limiting enabled for production');
} else {
  logger.info('Rate limiting disabled for development');
}
// CSRF protection disabled for now - uncomment when implementing on frontend
// app.use(csrfProtection);
// app.use(csrfTokenHandler);

// API routes
// CSRF token endpoint - disabled for now
// app.get('/api/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/user', userRoutes);
// app.use('/api/telegram', telegramRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // CSRF error handling - check if error has a 'code' property
  if ('code' in err && err.code === 'EBADCSRFTOKEN') {
    logger.warn('CSRF token validation failed', { url: req.originalUrl, ip: req.ip });
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  // General error logging
  if (err instanceof Error) {
    logger.error('Unhandled server error', { message: err.message, stack: err.stack });
  } else {
    logger.error('Unhandled server error (non-Error object)', { error: err });
  }

  return res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
