import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidTelegram, isStrongPassword } from '../validators';

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
      expect(isStrongPassword('alllowercase123!')).toBe(false); // no uppercase
      expect(isStrongPassword('ALLUPPERCASE123!')).toBe(false); // no lowercase
      expect(isStrongPassword('NoNumbers!')).toBe(false); // no numbers
      expect(isStrongPassword('NoSpecial123')).toBe(false); // no special char
    });
  });
});
