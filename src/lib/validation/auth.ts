/**
 * @file Zod validation schemas for authentication-related forms.
 * @module lib/validation/auth
 */

import { z } from 'zod';

// --- Login Schema ---
/**
 * Zod schema for validating login input.
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

/**
 * Type definition for login input, inferred from `loginSchema`.
 */
export type LoginInput = z.infer<typeof loginSchema>;

// --- Register Schema ---
/**
 * Zod schema for validating registration input.
 * Extends loginSchema and adds more fields and stricter password rules.
 */
export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    telegram: z
      .string()
      .min(1, 'Telegram account is required')
      .regex(
        /^@[a-zA-Z0-9_]{5,32}$/,
        'Invalid Telegram account format (e.g., @username, 5-32 chars, letters, numbers, underscore)'
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (!@#$%^&*)'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    agreement: z.boolean().refine((value) => value === true, {
      message: 'You must agree to the terms of use and privacy policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Set the error on the confirmPassword field
  });

/**
 * Type definition for registration input, inferred from `registerSchema`.
 */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Type definition for registration input excluding confirmPassword and agreement for API calls.
 */
export type RegisterInputForAPI = Omit<RegisterInput, 'confirmPassword' | 'agreement'>;

// --- Reset Password Schema ---
/**
 * Zod schema for validating reset password request input.
 */
export const resetPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
});

/**
 * Type definition for reset password input, inferred from `resetPasswordSchema`.
 */
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// --- Change Password Schema ---
/**
 * Zod schema for validating change password input.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Current password must be at least 8 characters'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'New password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'New password must contain at least one special character (!@#$%^&*)'),
    confirmPassword: z.string().min(1, 'New password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Type definition for change password input, inferred from `changePasswordSchema`.
 */
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
