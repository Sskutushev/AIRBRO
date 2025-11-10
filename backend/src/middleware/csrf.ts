// /**
//  * @file CSRF protection middleware for the backend.
//  * @module middleware/csrf
//  */

// import csurf from 'csurf';
// import { Request, Response, NextFunction } from 'express';

// // Configure csurf middleware
// // cookie: true tells csurf to use cookies for storing the CSRF token.
// // This is important for single-page applications where the token is sent via a header.
// const csrfProtection = csurf({ cookie: true });

// /**
//  * Middleware to handle CSRF token generation and validation.
//  * This should be applied to routes that require CSRF protection.
//  */
// export { csrfProtection };

// /**
//  * Middleware to make the CSRF token available to the frontend.
//  * This should be used on a GET endpoint (e.g., /api/csrf-token)
//  * that the frontend can call to retrieve the token.
//  * @param req The Express request object.
//  * @param res The Express response object.
//  * @param next The next middleware function.
//  */
// export const csrfTokenHandler = (req: Request, res: Response, next: NextFunction) => {
//   // req.csrfToken() is available after csurf middleware has run
//   // We don't need to do anything here, just ensure csurf has run
//   next();
// };
