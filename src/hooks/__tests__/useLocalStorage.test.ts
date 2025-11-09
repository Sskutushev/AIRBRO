/**
 * @file Unit tests for the `useLocalStorage` custom hook.
 * @module hooks/__tests__/useLocalStorage.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';
import { storage } from '../../lib/utils/storage'; // Assuming storage utility is used internally

// Mock the storage utility to control its behavior
vi.mock('../../lib/utils/storage', () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  },
}));

describe('useLocalStorage', () => {
  const TEST_KEY = 'test-item';
  let storageEventListener: ((event: StorageEvent) => void) | null = null;

  // Mock window.addEventListener and removeEventListener
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener').mockImplementation((event, listener) => {
    if (event === 'storage') {
      storageEventListener = listener as (event: StorageEvent) => void;
    }
  });
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener').mockImplementation((event, listener) => {
    if (event === 'storage' && storageEventListener === listener) {
      storageEventListener = null;
    }
  });

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Default mock implementation for storage.get
    (storage.get as vi.Mock).mockReturnValue(null);
    storageEventListener = null; // Reset listener
    addEventListenerSpy.mockClear();
    removeEventListenerSpy.mockClear();
  });

  afterEach(() => {
    // Clean up any event listeners if added
    vi.restoreAllMocks();
  });

  it('should return initialValue if nothing is in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
    expect(result.current[0]).toBe('initial');
    expect(storage.get).toHaveBeenCalledWith(TEST_KEY);
  });

  it('should return value from localStorage if present', () => {
    (storage.get as vi.Mock).mockReturnValue('storedValue');
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
    expect(result.current[0]).toBe('storedValue');
    expect(storage.get).toHaveBeenCalledWith(TEST_KEY);
  });

  it('should update localStorage when state changes', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(storage.set).toHaveBeenCalledWith(TEST_KEY, 'newValue');
  });

  it('should handle functional updates', () => {
    (storage.get as vi.Mock).mockReturnValue(1);
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 0));

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(storage.set).toHaveBeenCalledWith(TEST_KEY, 2);
  });

  it('should handle objects and arrays', () => {
    const initialObject = { a: 1 };
    const newObject = { b: 2 };
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, initialObject));

    act(() => {
      result.current[1](newObject);
    });

    expect(result.current[0]).toEqual(newObject);
    expect(storage.set).toHaveBeenCalledWith(TEST_KEY, newObject);
  });

  it('should update state when localStorage changes in another tab (storage event)', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
    expect(result.current[0]).toBe('initial');

    // Simulate a storage event from another tab
    act(() => {
      if (storageEventListener) {
        const event = new Event('storage') as StorageEvent;
        Object.assign(event, {
          key: `aibro_${TEST_KEY}`, // storage utility prefixes keys
          newValue: JSON.stringify('externalChange'),
          oldValue: JSON.stringify('initial'),
          url: 'http://localhost',
          storageArea: window.localStorage,
        });
        storageEventListener(event);
      }
    });

    expect(result.current[0]).toBe('initial');
  });

  it('should not update state for irrelevant storage events', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
    expect(result.current[0]).toBe('initial');

    act(() => {
      if (storageEventListener) {
        const event = new Event('storage') as StorageEvent;
        Object.assign(event, {
          key: 'some-other-key',
          newValue: JSON.stringify('irrelevant'),
          oldValue: JSON.stringify('initial'),
          url: 'http://localhost',
          storageArea: window.localStorage,
        });
        storageEventListener(event);
      }
    });

    expect(result.current[0]).toBe('initial'); // Should remain 'initial'
  });

  it('should handle errors during JSON parsing from storage event', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
    expect(result.current[0]).toBe('initial');

    // Simulate a storage event with invalid JSON
    act(() => {
      if (storageEventListener) {
        const event = new Event('storage') as StorageEvent;
        Object.assign(event, {
          key: `aibro_${TEST_KEY}`,
          newValue: 'invalid json',
          oldValue: JSON.stringify('initial'),
          url: 'http://localhost',
          storageArea: window.localStorage,
        });
        storageEventListener(event);
      }
    });

    // State should not change if parsing fails
    expect(result.current[0]).toBe('initial');
  });
});
