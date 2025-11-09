/**
 * @file Unit tests for the `useDebounce` custom hook.
 * @module hooks/__tests__/useDebounce.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Use fake timers for controlling setTimeout/clearTimeout
  });

  afterEach(() => {
    vi.runOnlyPendingTimers(); // Clear any pending timers
    vi.useRealTimers(); // Restore real timers
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should not update the debounced value until after the delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 500 },
    });

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 500 });
    expect(result.current).toBe('first'); // Value should still be 'first'

    act(() => {
      vi.advanceTimersByTime(499); // Advance just before the delay
    });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(1); // Advance past the delay
    });
    expect(result.current).toBe('second'); // Now it should be 'second'
  });

  it('should reset the timer if the value changes before the delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'first change', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('initial');

    rerender({ value: 'second change', delay: 500 }); // Change again, timer should reset
    act(() => {
      vi.advanceTimersByTime(400); // Not enough for the second change
    });
    expect(result.current).toBe('initial'); // Still initial

    act(() => {
      vi.advanceTimersByTime(100); // Now enough for the second change
    });
    expect(result.current).toBe('second change');
  });

  it('should handle a delay of 0 correctly (immediate update)', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 0 },
    });

    expect(result.current).toBe('initial');

    act(() => {
      rerender({ value: 'new value', delay: 0 });
    });
    expect(result.current).toBe('new value'); // Should update immediately
  });

  it('should handle unmounting correctly (cleanup timer)', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    rerender({ value: 'changed', delay: 500 });
    unmount();

    act(() => {
      vi.advanceTimersByTime(500); // Advance time, but timer should have been cleared
    });

    expect(result.current).toBe('initial'); // Should not update after unmount
  });
});
