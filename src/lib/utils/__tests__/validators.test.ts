import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidTelegram, isStrongPassword, validatePhoneNumber, validateUrl } from '../utils/validators';

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('isValidTelegram', () => {
    it('should validate correct telegram username', () => {
      expect(isValidTelegram('@username')).toBe(true);
      expect(isValidTelegram('@user_name123')).toBe(true);
    });

    it('should reject invalid telegram username', () => {
      expect(isValidTelegram('username')).toBe(false); // missing @
      expect(isValidTelegram('@usr')).toBe(false); // too short
      expect(isValidTelegram('@user-name')).toBe(false); // invalid character
    });
  });

  describe('isStrongPassword', () => {
    it('should validate strong password', () => {
      expect(isStrongPassword('Password123!')).toBe(true);
      expect(isStrongPassword('Str0ng@Pass')).toBe(true);
    });

    it('should reject weak password', () => {
      expect(isStrongPassword('short')).toBe(false); // too short
      expect(isValidEmail('alllowercase123!')).toBe(false); // no uppercase
      expect(isValidEmail('ALLUPPERCASE123!')).toBe(false); // no lowercase
      expect(isValidEmail('NoNumbers!')).toBe(false); // no numbers
      expect(isValidEmail('NoSpecial123')).toBe(false); // no special char
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhoneNumber('+79123456789')).toBe(true);
      expect(validatePhoneNumber('1234567890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('')).toBe(false);
      expect(validatePhoneNumber('short')).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://localhost:3000')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('invalid')).toBe(false);
      expect(validateUrl('')).toBe(false);
    });
  });
});