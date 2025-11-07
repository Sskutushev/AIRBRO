import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAsync } from '../useAsync';

describe('useAsync Hook', () => {
  it('should initially have null data, false loading, and null error', () => {
    const { result } = renderHook(() => useAsync<string>());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should execute promise successfully', async () => {
    const mockData = 'resolved data';
    const mockPromise = Promise.resolve(mockData);

    const { result } = renderHook(() => useAsync<string>());
    const { execute } = result.current;

    // Call execute
    const returnedData = await result.current.execute(mockPromise);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe(mockData);
      expect(result.current.error).toBeNull();
      expect(returnedData).toBe(mockData);
    });
  });

  it('should handle promise rejection', async () => {
    const mockError = new Error('Test error');

    const { result } = renderHook(() => useAsync<string, Error>());
    const { execute } = result.current;

    // Using a rejected promise
    const rejectedPromise = Promise.reject(mockError);

    try {
      await result.current.execute(rejectedPromise);
    } catch (error) {
      // Error is caught and stored in state
    }

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe(mockError);
    });
  });

  it('should update loading state during execution', async () => {
    const mockData = 'delayed data';
    // Create a delayed promise
    const delayedPromise = new Promise<string>((resolve) => {
      setTimeout(() => resolve(mockData), 10);
    });

    const { result } = renderHook(() => useAsync<string>());
    const { execute } = result.current;

    // Start execution
    const executePromise = result.current.execute(delayedPromise);

    // Check loading is true immediately
    expect(result.current.loading).toBe(true);

    // Wait for promise to resolve
    await executePromise;

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe(mockData);
    });
  });

  it('should reset state', async () => {
    const mockData = 'some data';
    const mockPromise = Promise.resolve(mockData);

    const { result } = renderHook(() => useAsync<string>());
    const { execute, reset } = result.current;

    // Execute to populate state
    await result.current.execute(mockPromise);

    await waitFor(() => {
      expect(result.current.data).toBe(mockData);
    });

    // Reset state
    result.current.reset();

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});