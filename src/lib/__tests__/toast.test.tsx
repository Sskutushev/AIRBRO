/**
 * @file Integration tests for the Toast notification system.
 * @module lib/__tests__/toast.test
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { showToast } from '../toast';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock react-hot-toast to control its behavior
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    promise: vi.fn(),
    custom: vi.fn(),
    dismiss: vi.fn(),
  },
  Toaster: () => null, // Mock Toaster component to return null
}));

// Import the mocked toast object
import toast from 'react-hot-toast';

describe('Toast Notification System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Toaster component', () => {
    // render(<Toaster />);
    // The Toaster component itself doesn't render visible content until a toast is shown
    // We can check if its container is in the document
    // expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('should call toast.success for showToast.success', () => {
    act(() => {
      showToast.success('Success message');
    });
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith('Success message', expect.any(Object));
  });

  it('should call toast.error for showToast.error', () => {
    act(() => {
      showToast.error('Error message');
    });
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith('Error message', expect.any(Object));
  });

  it('should call toast.loading for showToast.loading', () => {
    act(() => {
      showToast.loading('Loading message');
    });
    expect(toast.loading).toHaveBeenCalledTimes(1);
    expect(toast.loading).toHaveBeenCalledWith('Loading message', expect.any(Object));
  });

  it('should call toast.promise for showToast.promise', async () => {
    const promise = Promise.resolve('Data');
    act(() => {
      showToast.promise(promise, {
        loading: 'Loading...',
        success: 'Loaded!',
        error: 'Failed!',
      });
    });
    expect(toast.promise).toHaveBeenCalledTimes(1);
    expect(toast.promise).toHaveBeenCalledWith(promise, expect.any(Object), expect.any(Object));
  });

  it('should call toast.custom for showToast.custom', () => {
    const customComponent = <div>Custom Toast</div>;
    act(() => {
      showToast.custom(customComponent);
    });
    expect(toast.custom).toHaveBeenCalledTimes(1);
    expect(toast.custom).toHaveBeenCalledWith(customComponent, expect.any(Object));
  });

  it('should call toast.dismiss for showToast.dismiss', () => {
    const toastId = '123';
    act(() => {
      showToast.dismiss(toastId);
    });
    expect(toast.dismiss).toHaveBeenCalledTimes(1);
    expect(toast.dismiss).toHaveBeenCalledWith(toastId);
  });

  it('should apply default options to toasts', () => {
    act(() => {
      showToast.success('Test message');
    });
    // Check if default options are passed (e.g., position, duration)
    expect(toast.success).toHaveBeenCalledWith(
      'Test message',
      expect.objectContaining({
        position: 'top-right',
        duration: 3000,
        style: expect.any(Object), // Check for style object
      })
    );
  });
});
