import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to redirect HTTP requests to HTTPS in production
 * Only activates when NODE_ENV is 'production'
 */
export const httpsRedirect = (req: Request, res: Response, next: NextFunction) => {
  // Skip HTTPS redirect for OPTIONS requests (CORS preflight)
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Only apply HTTPS redirect in production environment
  if (process.env.NODE_ENV === 'production') {
    // Check if the request is already HTTPS
    // Using x-forwarded-proto header as proxy/load balancer would remove the original protocol
    if (req.header('x-forwarded-proto') !== 'https') {
      // Redirect to HTTPS version of the URL
      const httpsUrl = `https://${req.hostname}${req.url}`;
      return res.redirect(301, httpsUrl);
    }
  }

  // If not in production or already HTTPS, continue to next middleware
  next();
};

export default httpsRedirect;
