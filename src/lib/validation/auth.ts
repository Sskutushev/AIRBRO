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
  email: z.string().min(1, 'Email обязателен').email('Неверный формат email'),
  password: z.string().min(1, 'Пароль обязателен').min(8, 'Пароль должен быть не менее 8 символов'),
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
    name: z.string().min(2, 'Имя обязательно').max(50, 'Имя не может превышать 50 символов'),
    email: z.string().min(1, 'Email обязателен').email('Неверный формат email'),
    telegram: z
      .string()
      .min(1, 'Telegram-аккаунт обязателен')
      .regex(
        /^@[a-zA-Z0-9_]{5,32}$/,
        'Неверный формат Telegram-аккаунта (например, @username, 5-32 символов, буквы, цифры, подчеркивание)'
      ),
    password: z
      .string()
      .min(8, 'Пароль должен быть не менее 8 символов')
      .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
      .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
      .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
      .regex(/[^A-Za-z0-9]/, 'Пароль должен содержать хотя бы один специальный символ (!@#$%^&*)'),
    confirmPassword: z.string().min(1, 'Подтверждение пароля обязательно'),
    agreement: z.boolean().refine((value) => value === true, {
      message: 'Вы должны согласиться с условиями использования и политикой конфиденциальности',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
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
  email: z.string().min(1, 'Email обязателен').email('Неверный формат email'),
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
    currentPassword: z.string().min(8, 'Текущий пароль должен быть не менее 8 символов'),
    newPassword: z
      .string()
      .min(8, 'Новый пароль должен быть не менее 8 символов')
      .regex(/[A-Z]/, 'Новый пароль должен содержать хотя бы одну заглавную букву')
      .regex(/[a-z]/, 'Новый пароль должен содержать хотя бы одну строчную букву')
      .regex(/[0-9]/, 'Новый пароль должен содержать хотя бы одну цифру')
      .regex(
        /[^A-Za-z0-9]/,
        'Новый пароль должен содержать хотя бы один специальный символ (!@#$%^&*)'
      ),
    confirmPassword: z.string().min(1, 'Подтверждение нового пароля обязательно'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Новые пароли не совпадают',
    path: ['confirmPassword'],
  });

/**
 * Type definition for change password input, inferred from `changePasswordSchema`.
 */
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
