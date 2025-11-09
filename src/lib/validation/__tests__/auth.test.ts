/**
 * @file Unit tests for authentication validation schemas (loginSchema, registerSchema).
 * @module lib/validation/__tests__/auth.test
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { loginSchema, registerSchema, resetPasswordSchema } from '../auth.ts';

describe('Auth Validation Schemas', () => {
  // --- loginSchema tests ---
  describe('loginSchema', () => {
    it('should validate a correct login input', () => {
      const validLogin = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      expect(() => loginSchema.parse(validLogin)).not.toThrow();
    });

    it('should invalidate login with an invalid email format', () => {
      const invalidLogin = {
        email: 'invalid-email',
        password: 'Password123!',
      };
      expect(() => loginSchema.parse(invalidLogin)).toThrow('Неверный формат email');
    });

    it('should invalidate login with a password shorter than 8 characters', () => {
      const invalidLogin = {
        email: 'test@example.com',
        password: 'short',
      };
      expect(() => loginSchema.parse(invalidLogin)).toThrow(
        'Пароль должен быть не менее 8 символов'
      );
    });

    it('should invalidate login with missing email', () => {
      const invalidLogin = {
        email: '',
        password: 'Password123!',
      };
      let error;
      try {
        loginSchema.parse(invalidLogin);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(z.ZodError);
      expect(error.issues[0].message).toBe('Email обязателен');
    });

    it('should invalidate login with missing password', () => {
      const invalidLogin = {
        email: 'test@example.com',
        password: '',
      };
      let error;
      try {
        loginSchema.parse(invalidLogin);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(z.ZodError);
      expect(error.issues[0].message).toBe('Пароль обязателен');
    });
  });

  // --- registerSchema tests ---
  describe('registerSchema', () => {
    const baseValidRegister = {
      name: 'Test User',
      email: 'register@example.com',
      telegram: '@testuser',
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
      // agreement: true, // Removed as per UI changes
    };

    it('should validate a correct registration input', () => {
      // Remove agreement from baseValidRegister for this test
      const { agreement, ...validRegisterWithoutAgreement } = baseValidRegister;
      expect(() => registerSchema.parse(validRegisterWithoutAgreement)).not.toThrow();
    });

    it('should invalidate registration with missing name', () => {
      const invalidRegister = { ...baseValidRegister, name: '' };
      expect(() => registerSchema.parse(invalidRegister)).toThrow('Имя обязательно');
    });

    it('should invalidate registration with invalid email format', () => {
      const invalidRegister = { ...baseValidRegister, email: 'bad-email' };
      expect(() => registerSchema.parse(invalidRegister)).toThrow('Неверный формат email');
    });

    it('should invalidate registration with missing telegram username', () => {
      const invalidRegister = { ...baseValidRegister, telegram: '' };
      expect(() => registerSchema.parse(invalidRegister)).toThrow('Telegram-аккаунт обязателен');
    });

    it('should invalidate registration with invalid telegram username format', () => {
      const invalidRegister = { ...baseValidRegister, telegram: 'testuser' }; // Missing '@'
      expect(() => registerSchema.parse(invalidRegister)).toThrow(
        'Неверный формат Telegram-аккаунта (например, @username, 5-32 символов, буквы, цифры, подчеркивание)'
      );
    });

    it('should invalidate registration with password shorter than 8 characters', () => {
      const invalidRegister = { ...baseValidRegister, password: 'short', confirmPassword: 'short' };
      expect(() => registerSchema.parse(invalidRegister)).toThrow(
        'Пароль должен быть не менее 8 символов'
      );
    });

    it('should invalidate registration with password missing uppercase', () => {
      const invalidRegister = {
        ...baseValidRegister,
        password: 'strongpassword123!',
        confirmPassword: 'strongpassword123!',
      };
      expect(() => registerSchema.parse(invalidRegister)).toThrow(
        'Пароль должен содержать хотя бы одну заглавную букву'
      );
    });

    it('should invalidate registration with password missing lowercase', () => {
      const invalidRegister = {
        ...baseValidRegister,
        password: 'STRONGPASSWORD123!',
        confirmPassword: 'STRONGPASSWORD123!',
      };
      expect(() => registerSchema.parse(invalidRegister)).toThrow(
        'Пароль должен содержать хотя бы одну строчную букву'
      );
    });

    it('should invalidate registration with password missing number', () => {
      const invalidRegister = {
        ...baseValidRegister,
        password: 'StrongPassword!!',
        confirmPassword: 'StrongPassword!!',
      };
      expect(() => registerSchema.parse(invalidRegister)).toThrow(
        'Пароль должен содержать хотя бы одну цифру'
      );
    });

    it('should invalidate registration with password missing special character', () => {
      const invalidRegister = {
        ...baseValidRegister,
        password: 'StrongPassword123',
        confirmPassword: 'StrongPassword123',
      };
      expect(() => registerSchema.parse(invalidRegister)).toThrow(
        'Пароль должен содержать хотя бы один специальный символ'
      );
    });

    it('should invalidate registration when passwords do not match', () => {
      const invalidRegister = { ...baseValidRegister, confirmPassword: 'wrongpassword' };
      expect(() => registerSchema.parse(invalidRegister)).toThrow('Пароли не совпадают');
    });
  });

  // --- resetPasswordSchema tests ---
  describe('resetPasswordSchema', () => {
    it('should validate a correct email', () => {
      const validEmail = { email: 'test@example.com' };
      expect(() => resetPasswordSchema.parse(validEmail)).not.toThrow();
    });

    it('should invalidate with missing email', () => {
      const invalidEmail = { email: '' };
      expect(() => resetPasswordSchema.parse(invalidEmail)).toThrow('Email обязателен');
    });

    it('should invalidate with invalid email format', () => {
      const invalidEmail = { email: 'bad-email' };
      expect(() => resetPasswordSchema.parse(invalidEmail)).toThrow('Неверный формат email');
    });
  });
});
