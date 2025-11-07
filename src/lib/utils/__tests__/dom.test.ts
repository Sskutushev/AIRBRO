import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { scrollToElement, copyToClipboard, formatCurrency, formatDate } from '../dom';

describe('DOM Utilities', () => {
  describe('scrollToElement', () => {
    const mockElement = {
      getBoundingClientRect: vi.fn(),
    };

    beforeEach(() => {
      // Mock scrollTo function
      window.scrollTo = vi.fn();
      document.getElementById = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should scroll to element if it exists', () => {
      const mockRect = { top: 100 };
      mockElement.getBoundingClientRect.mockReturnValue(mockRect);
      (document.getElementById as vi.Mock).mockReturnValue(mockElement);

      scrollToElement('test-id');

      expect(document.getElementById).toHaveBeenCalledWith('test-id');
      expect(window.scrollTo).toHaveBeenCalled();
    });

    it('should not scroll if element does not exist', () => {
      (document.getElementById as vi.Mock).mockReturnValue(null);

      scrollToElement('nonexistent-id');

      expect(document.getElementById).toHaveBeenCalledWith('nonexistent-id');
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('copyToClipboard', () => {
    beforeEach(() => {
      navigator.clipboard = {
        writeText: vi.fn(),
      };
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should copy text to clipboard successfully', async () => {
      (navigator.clipboard.writeText as vi.Mock).mockResolvedValue(undefined);

      const result = await copyToClipboard('test text');

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });

    it('should return false if copying fails', async () => {
      (navigator.clipboard.writeText as vi.Mock).mockRejectedValue(new Error());

      const result = await copyToClipboard('test text');

      expect(result).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      const result = formatCurrency(1000, 'RUB');

      // Basic check that it contains the expected elements
      expect(result).toContain('1 000');
    });

    it('should format with default currency', () => {
      const result = formatCurrency(100);

      expect(result).toContain('100');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-15');
      const result = formatDate(date);

      // Check that it contains the expected elements
      expect(result).toContain('2025');
    });

    it('should format date from string', () => {
      const result = formatDate('2025-01-15');

      expect(result).toContain('2025');
    });
  });
});