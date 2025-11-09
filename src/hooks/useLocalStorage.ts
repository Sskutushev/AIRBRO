/**
 * @file Custom hook for synchronizing React state with localStorage.
 * @module hooks/useLocalStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/utils/storage'; // Assuming storage utility is available

/**
 * A custom React hook that provides state management synchronized with localStorage.
 * It mimics the `useState` API but persists the value across browser sessions
 * and synchronizes changes across multiple tabs/windows.
 *
 * @template T The type of the value to store in localStorage.
 * @param {string} key The key under which to store the value in localStorage.
 * @param {T | (() => T)} initialValue The initial value or a function that returns the initial value.
 * @returns {[T, (value: T | ((val: T) => T)) => void]} A tuple containing the current state value and a setter function.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((val: T) => T)) => void] {
  // Helper to get initial value, supporting lazy initialization and SSR safety
  const getInitialValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      // Return initial value for SSR
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
    try {
      const storedValue = storage.get<T>(key);
      if (storedValue !== null) {
        return storedValue;
      }
      // If nothing in storage, use initialValue
      return initialValue instanceof Function ? initialValue() : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  }, [key, initialValue]);

  const [value, setValue] = useState<T>(getInitialValue);

  // Effect to update localStorage when the state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      storage.set(key, value);
    }
  }, [key, value]);

  // Effect to synchronize state across tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      // Check if the changed key is relevant to this hook instance
      if (event.key === storage['getPrefixedKey'](key)) {
        // Access private method for prefixed key
        try {
          const newValue = event.newValue ? JSON.parse(event.newValue) : null;
          setValue(newValue);
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  // Custom setter function that mimics useState's functional updates
  const setStoredValue = useCallback((newValue: T | ((val: T) => T)) => {
    setValue((currentValue) => {
      const finalValue = newValue instanceof Function ? newValue(currentValue) : newValue;
      return finalValue;
    });
  }, []);

  return [value, setStoredValue];
}
