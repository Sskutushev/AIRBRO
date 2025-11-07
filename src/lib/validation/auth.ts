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

export const contactSchema = z.object({
  name: z.string().min(2, 'Имя обязательно'),
  email: z.string().email('Неверный email'),
  telegram: z.string().regex(/^@[a-zA-Z0-9_]{5,32}$/),
  business: z.string().min(2, 'Название бизнеса обязательно'),
  product: z.string().min(1, 'Выберите продукт'),
  description: z.string().min(10, 'Минимум 10 символов'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;