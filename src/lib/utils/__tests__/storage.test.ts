/**
 * @file Unit tests for the `StorageService` utility.
 * @module lib/utils/__tests__/storage.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { storage } from '../storage'; // Import the singleton instance

describe('StorageService', () => {
  const TEST_KEY = 'testKey';
  const TEST_VALUE = { data: 'testValue' };
  const PREFIX = 'aibro_'; // Default prefix from StorageService

  // Mock localStorage before each test
  let localStorageMock: Storage;
  let setItemSpy: ReturnType<typeof vi.spyOn>;
  let getItemSpy: ReturnType<typeof vi.spyOn>;
  let removeItemSpy: ReturnType<typeof vi.spyOn>;
  let clearSpy: ReturnType<typeof vi.spyOn>;
  let store: Record<string, string>; // Internal store for the mock

  beforeEach(() => {
    store = {}; // Reset store for each test

    localStorageMock = {
      get length() {
        return Object.keys(store).length;
      },
      clear: vi.fn(() => {
        store = {};
      }),
      getItem: vi.fn((key: string) => {
        return store[key] || null;
      }),
      key: vi.fn((index: number) => Object.keys(store)[index] || null),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
    };

    setItemSpy = vi.spyOn(localStorageMock, 'setItem');
    getItemSpy = vi.spyOn(localStorageMock, 'getItem');
    removeItemSpy = vi.spyOn(localStorageMock, 'removeItem');
    clearSpy = vi.spyOn(localStorageMock, 'clear');

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Reset all mocks on the storage service methods
    vi.clearAllMocks();
  });

  it('should set and get an item correctly', () => {
    storage.set(TEST_KEY, TEST_VALUE);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      PREFIX + TEST_KEY,
      JSON.stringify(TEST_VALUE)
    );
    const retrieved = storage.get(TEST_KEY);
    expect(window.localStorage.getItem).toHaveBeenCalledWith(PREFIX + TEST_KEY);
    expect(retrieved).toEqual(TEST_VALUE);
  });

  it('should return null if item does not exist', () => {
    const retrieved = storage.get('nonExistentKey');
    expect(window.localStorage.getItem).toHaveBeenCalledWith(PREFIX + 'nonExistentKey');
    expect(retrieved).toBeNull();
  });

  it('should remove an item correctly', () => {
    storage.set(TEST_KEY, TEST_VALUE);
    storage.remove(TEST_KEY);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(PREFIX + TEST_KEY);
    expect(storage.get(TEST_KEY)).toBeNull();
  });

  it('should clear only prefixed items', () => {
    // Set some items using the storage service
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');
    // Simulate an external item not managed by the storage service
    store['externalKey'] = JSON.stringify('externalValue');

    storage.clear();

    expect(removeItemSpy).toHaveBeenCalledWith(PREFIX + 'key1');
    expect(removeItemSpy).toHaveBeenCalledWith(PREFIX + 'key2');
    expect(removeItemSpy).not.toHaveBeenCalledWith('externalKey');

    expect(storage.get('key1')).toBeNull();
    expect(storage.get('key2')).toBeNull();
    expect(store['externalKey']).toBe(JSON.stringify('externalValue')); // Check internal store directly
  });

  it('should handle errors during set operation', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Simulate localStorage.setItem throwing an error (e.g., quota exceeded)
    setItemSpy.mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    storage.set(TEST_KEY, TEST_VALUE);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should handle errors during get operation (invalid JSON)', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    window.localStorage.setItem(PREFIX + TEST_KEY, 'invalid json');

    const retrieved = storage.get(TEST_KEY);
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(retrieved).toBeNull();
    consoleErrorSpy.mockRestore();
  });

  it('should warn if localStorage is not available during set', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const originalWindow = (globalThis as any).window;
    // Temporarily make window.localStorage undefined
    Object.defineProperty(globalThis, 'window', {
      value: { localStorage: undefined },
      writable: true,
    });

    storage.set(TEST_KEY, TEST_VALUE);
    expect(consoleWarnSpy).toHaveBeenCalledWith('localStorage is not available.');
    consoleWarnSpy.mockRestore();
    (globalThis as any).window = originalWindow; // Restore original window
  });

  it('should warn if localStorage is not available during get', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const originalWindow = (globalThis as any).window;
    Object.defineProperty(globalThis, 'window', {
      value: { localStorage: undefined },
      writable: true,
    });

    const retrieved = storage.get(TEST_KEY);
    expect(consoleWarnSpy).toHaveBeenCalledWith('localStorage is not available.');
    expect(retrieved).toBeNull();
    consoleWarnSpy.mockRestore();
    (globalThis as any).window = originalWindow;
  });
});
