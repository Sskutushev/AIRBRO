// Now, validate and import other modules
import './config/environment'; // This validates env variables
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
// import { csrfProtection, csrfTokenHandler } from './middleware/csrf';
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

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://airbro-mrqs.vercel.app',
    'https://airbro-production.up.railway.app',
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token'],
};
app.use(cors(corsOptions));

// General middleware
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Security middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);
// app.use(csrfProtection);
// app.use(csrfTokenHandler);

// API routes
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
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // CSRF error handling
  // if (err.code === 'EBADCSRFTOKEN') {
  //   logger.warn('CSRF token validation failed', { url: req.originalUrl, ip: req.ip });
  //   return res.status(403).json({ error: 'Invalid CSRF token' });
  // }

  // General error logging
  if (err instanceof Error) {
    logger.error('Unhandled server error', { message: err.message, stack: err.stack });
  } else {
    logger.error('Unhandled server error (non-Error object)', { error: err });
  }

  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
