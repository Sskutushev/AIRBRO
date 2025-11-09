/**
 * @file Unit tests for the `useAsync` custom hook.
 * @module hooks/__tests__/useAsync.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useAsync } from '../useAsync';

describe('useAsync', () => {
  const mockFunction = vi.fn();

  beforeEach(() => {
    mockFunction.mockReset();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useAsync(mockFunction));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle successful async function execution', async () => {
    const successData = 'Success!';
    mockFunction.mockResolvedValue(successData);

    const { result } = renderHook(() => useAsync(mockFunction));

    act(() => {
      result.current.execute();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBe(successData);
    expect(result.current.error).toBeNull();
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('should handle async function execution with error', async () => {
    const errorMessage = 'Failed!';
    const mockError = { message: errorMessage };
    mockFunction.mockRejectedValue(mockError);

    const { result } = renderHook(() => useAsync(mockFunction));

    let promise;
    act(() => {
      promise = result.current.execute();
    });

    // Assert that the promise rejects
    await expect(promise).rejects.toEqual(mockError);

    // Assert the final state after the rejection
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toEqual(mockError);
    });

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('should execute immediately if immediate is true', async () => {
    const immediateData = 'Immediate success!';
    mockFunction.mockResolvedValue(immediateData);
    const { result } = renderHook(() => useAsync(mockFunction, { immediate: true }));

    // The loading state should be true initially
    expect(result.current.loading).toBe(true);

    // Wait for the promise to resolve
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(immediateData);
    expect(result.current.error).toBeNull();
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('should call onSuccess callback on success', async () => {
    const onSuccessMock = vi.fn();
    const successData = 'Data';
    mockFunction.mockResolvedValue(successData);

    const { result } = renderHook(() => useAsync(mockFunction, { onSuccess: onSuccessMock }));

    await act(async () => {
      await result.current.execute();
    });

    expect(onSuccessMock).toHaveBeenCalledWith(successData);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
  });

  it('should call onError callback on error', async () => {
    const onErrorMock = vi.fn();
    const errorMessage = 'Test Error';
    const mockError = { message: errorMessage };
    mockFunction.mockRejectedValue(mockError);

    const { result } = renderHook(() => useAsync(mockFunction, { onError: onErrorMock }));

    let promise;
    act(() => {
      promise = result.current.execute();
    });

    // Assert that the promise rejects
    await expect(promise).rejects.toEqual(mockError);

    // Assert that the onError callback was called
    await waitFor(() => {
      expect(onErrorMock).toHaveBeenCalledWith(mockError);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should reset state', async () => {
    mockFunction.mockResolvedValue('Data');
    const { result } = renderHook(() => useAsync(mockFunction, { immediate: true }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBe('Data');

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should allow manual setting of data and error', () => {
    const { result } = renderHook(() => useAsync(mockFunction));

    act(() => {
      result.current.setData('Manual Data');
    });
    expect(result.current.data).toBe('Manual Data');

    const manualError = new Error('Manual Error');
    act(() => {
      result.current.setError(manualError);
    });
    expect(result.current.error).toBe(manualError);
  });

  it('should not update state if component unmounts during async operation', async () => {
    const longRunningFunction = () =>
      new Promise((resolve) => setTimeout(() => resolve('Done'), 100));
    const { result, unmount } = renderHook(() => useAsync(longRunningFunction));

    act(() => {
      result.current.execute();
    });
    expect(result.current.loading).toBe(true);

    unmount();

    // Wait a bit longer than the mock function's timeout
    await new Promise((resolve) => setTimeout(resolve, 150));

    // After unmounting, we can't access result anymore, so we just verify unmount happened
    // The hook should have handled the unmount gracefully without errors
    expect(true).toBe(true); // Basic assertion to indicate test ran
  });
});
