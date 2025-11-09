/**
 * @file Unit tests for DOM utility functions.
 * @module lib/utils/__tests__/dom.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scrollToElement, copyToClipboard, formatCurrency, formatDate } from '../dom';

describe('DOM Utilities', () => {
  // Mock window.scrollTo for scrollToElement tests
  const scrollToSpy = vi.fn();
  Object.defineProperty(window, 'scrollTo', { value: scrollToSpy, writable: true });

  beforeEach(() => {
    scrollToSpy.mockClear();
  });

  describe('scrollToElement', () => {
    it('should scroll to the element if found', () => {
      const mockElement = {
        getBoundingClientRect: () => ({ top: 100 }),
      };
      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as HTMLElement);

      scrollToElement('test-id', 50);
      expect(document.getElementById).toHaveBeenCalledWith('test-id');
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 150 + window.pageYOffset,
        behavior: 'smooth',
      });
    });

    it('should not scroll if element is not found', () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null);

      scrollToElement('non-existent-id');
      expect(document.getElementById).toHaveBeenCalledWith('non-existent-id');
      expect(scrollToSpy).not.toHaveBeenCalled();
    });

    it('should use default offset if not provided', () => {
      const mockElement = {
        getBoundingClientRect: () => ({ top: 100 }),
      };
      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as HTMLElement);

      scrollToElement('test-id'); // No offset provided
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 100 + window.pageYOffset,
        behavior: 'smooth',
      });
    });
  });

  describe('copyToClipboard', () => {
    const writeTextSpy = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextSpy },
      writable: true,
    });

    beforeEach(() => {
      writeTextSpy.mockClear();
    });

    it('should successfully copy text to clipboard', async () => {
      writeTextSpy.mockResolvedValue(undefined);
      const result = await copyToClipboard('test text');
      expect(writeTextSpy).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });

    it('should return false and log error if copy fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      writeTextSpy.mockRejectedValue(new Error('Copy failed'));
      const result = await copyToClipboard('test text');
      expect(writeTextSpy).toHaveBeenCalledWith('test text');
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });

  describe('formatCurrency', () => {
        it('should format currency in RUB by default', () => {
          expect(formatCurrency(12345.67)).toBe('12 346 ₽');
          expect(formatCurrency(1000)).toBe('1 000 ₽');
        });
    
            it('should format currency with specified currency', () => {
              const expectedUsd = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(123.45);
              const actualUsd = formatCurrency(123.45, 'USD', 'en-US');
              console.log('Expected USD:', expectedUsd);
              console.log('Actual USD:', actualUsd);
              expect(actualUsd).toBe(expectedUsd);
              expect(formatCurrency(99.99, 'EUR', 'en-US')).toBe('€100');
            });
    it('should handle zero amount', () => {
      expect(formatCurrency(0)).toBe('0 ₽');
    });

    it('should handle negative amount', () => {
      expect(formatCurrency(-500)).toBe('-500 ₽');
    });
  });

  describe('formatDate', () => {
    it('should format a Date object correctly in Russian locale', () => {
      const date = new Date('2023-01-15T10:00:00Z');
      expect(formatDate(date)).toBe('15 января 2023 г.');
    });

    it('should format a date string correctly in Russian locale', () => {
      const dateString = '2024-03-01T15:30:00Z';
      expect(formatDate(dateString)).toBe('1 марта 2024 г.');
    });

    it('should format with a different locale', () => {
      const date = new Date('2023-01-15T10:00:00Z');
      expect(formatDate(date, 'en-US')).toBe('January 15, 2023');
    });

    it('should handle invalid date gracefully', () => {
      const invalidDate = new Date('invalid date');
      expect(formatDate(invalidDate)).toBe('');
    });
  });
});
