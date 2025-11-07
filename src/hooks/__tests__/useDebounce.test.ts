import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Изменяем значение
    rerender({ value: 'changed', delay: 500 });

    // Сразу после изменения значение не должно обновиться
    expect(result.current).toBe('initial');

    // После задержки значение должно обновиться
    await waitFor(
      () => {
        expect(result.current).toBe('changed');
      },
      { timeout: 600 }
    );
  });
});
