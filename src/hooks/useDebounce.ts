/**
 * @file Custom hook for debouncing values.
 * @module hooks/useDebounce
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Debounces a value, returning the debounced value after a specified delay.
 * Useful for delaying expensive operations like API calls or heavy computations
 * until the user has stopped typing or interacting.
 *
 * @template T The type of the value to debounce.
 * @param {T} value The value to debounce.
 * @param {number} [delay=500] The delay in milliseconds before the debounced value is updated.
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // Ref to store the timeout ID
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // If delay is 0, update immediately
    if (delay === 0) {
      setDebouncedValue((prevValue) => {
        // Only update if value actually changed
        if (prevValue !== value) {
          return value;
        }
        return prevValue;
      });
      return;
    }

    // Clear previous timeout if value or delay changes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to update the debounced value
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: clear the timeout when the component unmounts
    // or when the value/delay changes before the timeout fires
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]); // Re-run effect if value or delay changes

  return debouncedValue;
}
