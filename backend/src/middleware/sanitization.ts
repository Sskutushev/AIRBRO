import { Request, Response, NextFunction } from 'express';
import { filterXSS } from 'xss';

/**
 * Sanitizes user input to prevent XSS attacks
 * This middleware sanitizes all incoming request body, query, and params
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * Recursively sanitizes an object by removing potentially dangerous content
 * @param obj - The object to sanitize
 * @returns Sanitized object
 */
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    // Sanitize string values using the xss library
    return filterXSS(obj);
  }

  if (Array.isArray(obj)) {
    // Sanitize each element in the array
    return obj.map((item) => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    // Sanitize each property in the object
    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  // For other types (number, boolean, etc.), return as is
  return obj;
}

export default sanitizeInput;
