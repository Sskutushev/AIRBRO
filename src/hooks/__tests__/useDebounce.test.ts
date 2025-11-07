import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));

    expect(result.current).toBe('initial');
  });

  it('should return the same value when unchanged', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'test', delay: 500 },
    });

    expect(result.current).toBe('test');

    // Rerender with same value
    rerender({ value: 'test', delay: 500 });

    expect(result.current).toBe('test');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 500 });

    // Should still be initial value because timer hasn't fired yet
    expect(result.current).toBe('initial');

    // Advance timers to trigger update
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should now be updated value
    expect(result.current).toBe('updated');
  });

  it('should respect different delays', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 1000 },
    });

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 1000 });

    // Should still be initial value because timer hasn't fired yet
    expect(result.current).toBe('initial');

    // Advance timers only partway
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should still be initial value 
    expect(result.current).toBe('initial');

    // Advance remaining time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should now be updated value
    expect(result.current).toBe('updated');
  });

  it('should handle rapid updates correctly', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    // Rapidly update value multiple times
    rerender({ value: 'updated1', delay: 500 });
    rerender({ value: 'updated2', delay: 500 });
    rerender({ value: 'updated3', delay: 500 });

    // Should still be initial value because timers keep getting reset
    expect(result.current).toBe('initial');

    // Advance timers to trigger the final update
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should now be the final updated value
    expect(result.current).toBe('updated3');
  });
});