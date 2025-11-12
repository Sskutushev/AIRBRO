import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
      return;
    } catch (error: unknown) {
      const zodError = error as { errors?: Array<{ path: string[]; message: string }> };
      const errors = zodError.errors?.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })) || [{ field: 'validation', message: 'Invalid request format' }];

      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }
  };
};
