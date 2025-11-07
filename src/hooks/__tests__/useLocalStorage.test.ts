import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLocalStorage Hook', () => {
  const testKey = 'testKey';
  const initialValue = 'initialValue';

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with initial value when nothing in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(testKey, initialValue));

    expect(result.current[0]).toBe(initialValue);
  });

  it('should initialize with stored value if exists in localStorage', () => {
    const storedValue = 'storedValue';
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedValue));

    const { result } = renderHook(() => useLocalStorage(testKey, initialValue));

    expect(result.current[0]).toBe(storedValue);
  });

  it('should update state and localStorage when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage(testKey, initialValue));

    const newValue = 'newValue';
    
    act(() => {
      const [, setValue] = result.current;
      setValue(newValue);
    });

    const [value, setValue] = result.current;
    expect(value).toBe(newValue);
    expect(setValue).toBeDefined(); // Ensure setter is still available
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'aibro_' + testKey,
      JSON.stringify(newValue)
    );
  });

  it('should update using setter function', () => {
    const { result } = renderHook(() => useLocalStorage(testKey, 0)); // Use a number as initial value

    act(() => {
      const [, setValue] = result.current;
      setValue(prev => prev + 1);
    });

    const [value] = result.current;
    expect(value).toBe(1);
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock error when setting item
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    const { result } = renderHook(() => useLocalStorage(testKey, initialValue));

    act(() => {
      const [, setValue] = result.current;
      setValue('new value');
    });

    // Value in state should still update even if localStorage fails
    const [value] = result.current;
    expect(value).toBe('new value');
  });

  it('should preserve reference equality for the setter', () => {
    const { result, rerender } = renderHook(() => useLocalStorage(testKey, initialValue));

    const [, firstSetter] = result.current;

    rerender();

    const [, secondSetter] = result.current;

    // The setter function should maintain reference equality between renders
    expect(firstSetter).toBe(secondSetter);
  });
});