import { z } from 'zod';

// User registration validation schema
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    telegram: z.string().regex(/^@[a-zA-Z0-9_]{5,}$/, 'Invalid Telegram username format (e.g. @username)')
  })
});

// User login validation schema
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  })
});

// Add to cart validation schema
export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID format'),
    quantity: z.number().int().min(1).default(1)
  })
});

// Create payment validation schema
export const createPaymentSchema = z.object({
  body: z.object({
    cartItems: z.array(z.string().uuid()).min(1, 'At least one cart item is required'),
    paymentMethod: z.enum([
      'crypto_usdt_trc20',
      'crypto_usdt_erc20',
      'crypto_ton'
    ], { message: 'Invalid payment method' })
  })
});

// Confirm payment validation schema
export const confirmPaymentSchema = z.object({
  body: z.object({
    txHash: z.string().min(1, 'Transaction hash is required')
  })
});

// Update profile validation schema
export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    telegram: z.string().regex(/^@[a-zA-Z0-9_]{5,}$/, 'Invalid Telegram username format').optional()
  }).refine(obj => obj.name !== undefined || obj.telegram !== undefined, {
    message: 'At least one field (name or telegram) must be provided'
  })
});