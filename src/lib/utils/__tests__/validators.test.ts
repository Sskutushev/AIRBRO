/**
 * @file Unit tests for validation utility functions.
 * @module lib/utils/__tests__/validators.test
 */

import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidTelegram,
  isStrongPassword,
  validatePhoneNumber,
  validateUrl,
} from '../validators';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@sub.domain.co')).toBe(true);
      expect(isValidEmail('name+tag@example.info')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@example')).toBe(false);
      expect(isValidEmail('user@example,com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(' user@example.com')).toBe(false);
      expect(isValidEmail('user@example.com ')).toBe(false);
    });
  });

  describe('isValidTelegram', () => {
    it('should return true for valid Telegram usernames', () => {
      expect(isValidTelegram('@username')).toBe(true);
      expect(isValidTelegram('@user_name')).toBe(true);
      expect(isValidTelegram('@user123')).toBe(true);
      expect(isValidTelegram('@a_long_username_with_numbers_123')).toBe(true); // Max length 32
      expect(isValidTelegram('@aaaaa')).toBe(true); // Min length 5
    });

    it('should return false for invalid Telegram usernames', () => {
      expect(isValidTelegram('username')).toBe(false); // Missing @
      expect(isValidTelegram('@')).toBe(false); // Too short
      expect(isValidTelegram('@abc')).toBe(false); // Too short
      expect(isValidTelegram('@UsErNaMe')).toBe(true); // Telegram usernames are case-insensitive when checking availability, but often displayed in lowercase or as entered. Our validator should probably allow case. (Current regex ^@[a-zA-Z0-9_]{5,32}$ allows it)
      expect(isValidTelegram('@invalid-char')).toBe(false); // Invalid characters
      expect(isValidTelegram('@too_long_username_with_many_characters_1234567890')).toBe(false); // Too long
      expect(isValidTelegram(' @username')).toBe(false); // Leading space
      expect(isValidTelegram('@username ')).toBe(false); // Trailing space
      expect(isValidTelegram('')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should return true for strong passwords', () => {
      expect(isStrongPassword('StrongPass1!')).toBe(true);
      expect(isStrongPassword('P@sswOrd123')).toBe(true);
      expect(isStrongPassword('My$uperS3cretP@ssword')).toBe(true);
    });

    it('should return false for weak passwords (missing criteria)', () => {
      expect(isStrongPassword('weakpass')).toBe(false); // No uppercase, number, special
      expect(isStrongPassword('WEAKPASS1!')).toBe(false); // No lowercase
      expect(isStrongPassword('weakpass!@#')).toBe(false); // No number
      expect(isStrongPassword('Weakpass123')).toBe(false); // No special character
      expect(isStrongPassword('Weak!1')).toBe(false); // Too short (< 8 chars)
      expect(isStrongPassword('abcdefgh')).toBe(false); // Only lowercase
      expect(isStrongPassword('12345678')).toBe(false); // Only numbers
      expect(isStrongPassword('!@#$%^&*')).toBe(false); // Only special chars
      expect(isStrongPassword('Weakpass1!')).toBe(true); // This should be true based on the criteria
    });
  });

  describe('validatePhoneNumber', () => {
    it('should return true for valid phone numbers', () => {
      expect(validatePhoneNumber('+1234567890')).toBe(true);
      expect(validatePhoneNumber('1234567890')).toBe(true);
      expect(validatePhoneNumber('8 (999) 123-45-67')).toBe(true); // With spaces and symbols
    });

    it('should return false for invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false); // Too short
      expect(validatePhoneNumber('abc')).toBe(false);
      expect(validatePhoneNumber('+12345678901234567890')).toBe(false); // Too long
      expect(validatePhoneNumber('')).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('should return true for valid URLs', () => {
      expect(validateUrl('http://example.com')).toBe(true);
      expect(validateUrl('https://www.example.com/path?query=1#hash')).toBe(true);
      expect(validateUrl('ftp://ftp.example.com')).toBe(true);
      expect(validateUrl('http://localhost:3000')).toBe(true);
      expect(validateUrl('https://example.com/path/to/file.html')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(validateUrl('invalid-url')).toBe(false);
      expect(validateUrl('example.com')).toBe(false); // Missing protocol
      expect(validateUrl('www.example.com')).toBe(false); // Missing protocol
      expect(validateUrl('htp://example.com')).toBe(false); // Malformed protocol
      expect(validateUrl('')).toBe(false);
    });
  });
});
