/**
 * @file Custom hook for managing asynchronous operations.
 * @module hooks/useAsync
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Represents the state of an asynchronous operation.
 * @template T The type of the data returned by the async operation.
 * @template E The type of the error thrown by the async operation.
 */
interface AsyncState<T, E = Error> {
  data: T | null;
  loading: boolean;
  error: E | null;
}

/**
 * Options for the useAsync hook.
 * @template T The type of the data returned by the async operation.
 * @template E The type of the error thrown by the async operation.
 */
interface UseAsyncOptions<T, E = Error> {
  /** Callback function to execute on successful completion of the async operation. */
  onSuccess?: (data: T) => void;
  /** Callback function to execute on error during the async operation. */
  onError?: (error: E) => void;
  /** If true, the async operation will be executed immediately on mount. */
  immediate?: boolean;
}

/**
 * A universal hook for managing asynchronous operations, providing state for data, loading, and errors.
 * It prevents memory leaks by checking if the component is still mounted before updating state.
 *
 * @template T The type of the data returned by the async operation.
 * @template E The type of the error thrown by the async operation.
 * @param {() => Promise<T>} asyncFunction The asynchronous function to execute.
 * @param {UseAsyncOptions<T, E>} [options] Optional configuration for the hook.
 * @returns {{
 *   data: T | null;
 *   loading: boolean;
 *   error: E | null;
 *   execute: (...args: unknown[]) => Promise<T>;
 *   reset: () => void;
 *   setData: (data: T) => void;
 *   setError: (error: E) => void;
 * }} The current state and control functions for the async operation.
 */
export function useAsync<T, E = Error>(
  asyncFunction: (...args: unknown[]) => Promise<T>,
  options?: UseAsyncOptions<T, E>
) {
  const { onSuccess, onError, immediate = false } = options || {};

  const [state, setState] = useState<AsyncState<T, E>>({
    data: null,
    loading: false,
    error: null,
  });

  // Ref to track if the component is mounted to prevent memory leaks
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Executes the asynchronous function.
   * @param {...unknown[]} args Arguments to pass to the async function.
   * @returns {Promise<T>} A promise that resolves with the data or rejects with an error.
   */
  const execute = useCallback(
    async (...args: unknown[]): Promise<T> => {
      if (mountedRef.current) {
        setState((prevState) => ({ ...prevState, loading: true, error: null }));
      }

      try {
        const result = await asyncFunction(...args);
        if (mountedRef.current) {
          setState((prevState) => ({ ...prevState, data: result, loading: false }));
          onSuccess?.(result);
        }
        return result;
      } catch (err: unknown) {
        if (mountedRef.current) {
          setState((prevState) => ({ ...prevState, error: err as E, loading: false }));
          onError?.(err as E);
        }
        throw err; // Re-throw the error so callers can handle it
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  /**
   * Resets the state of the async operation to its initial values.
   */
  const reset = useCallback(() => {
    if (mountedRef.current) {
      setState({ data: null, loading: false, error: null });
    }
  }, []);

  /**
   * Manually sets the data state.
   * @param {T} data The data to set.
   */
  const setData = useCallback((data: T) => {
    if (mountedRef.current) {
      setState((prevState) => ({ ...prevState, data }));
    }
  }, []);

  /**
   * Manually sets the error state.
   * @param {E} error The error to set.
   */
  const setError = useCallback((error: E) => {
    if (mountedRef.current) {
      setState((prevState) => ({ ...prevState, error }));
    }
  }, []);

  // Execute immediately if options.immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
    setData,
    setError,
  };
}
