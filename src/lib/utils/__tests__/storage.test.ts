import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { storage } from '../storage';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('StorageService', () => {
  const testKey = 'testKey';
  const testData = { name: 'Test', value: 123 };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set item to localStorage with prefix', () => {
    storage.set(testKey, testData);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'aibro_' + testKey,
      JSON.stringify(testData)
    );
  });

  it('should get item from localStorage with prefix', () => {
    const serializedData = JSON.stringify(testData);
    localStorageMock.getItem.mockReturnValue(serializedData);

    const result = storage.get(testKey);

    expect(localStorage.getItem).toHaveBeenCalledWith('aibro_' + testKey);
    expect(result).toEqual(testData);
  });

  it('should return null if item does not exist', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const result = storage.get(testKey);

    expect(result).toBeNull();
  });

  it('should handle JSON parsing errors gracefully', () => {
    localStorageMock.getItem.mockReturnValue('{ invalid json }');

    const result = storage.get(testKey);

    expect(result).toBeNull();
  });

  it('should remove item with prefix', () => {
    storage.remove(testKey);

    expect(localStorage.removeItem).toHaveBeenCalledWith('aibro_' + testKey);
  });

  it('should clear prefixed items', () => {
    const allKeys = ['aibro_test', 'aibro_other', 'non_prefixed'];
    Object.defineProperty(window.localStorage, 'length', { value: allKeys.length });
    Object.defineProperty(window.localStorage, 'key', {
      value: (i: number) => allKeys[i],
    });

    storage.clear();

    expect(localStorage.removeItem).toHaveBeenCalledTimes(2); // Only prefixed items
    expect(localStorage.removeItem).toHaveBeenCalledWith('aibro_test');
    expect(localStorage.removeItem).toHaveBeenCalledWith('aibro_other');
  });
});