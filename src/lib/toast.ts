/**
 * @file Wrapper for react-hot-toast to provide a consistent and easy-to-use toast notification system.
 * @module lib/toast
 */

import toast, { Toaster } from 'react-hot-toast';
import type { ToastOptions } from 'react-hot-toast';
import type { ReactNode } from 'react';

// Default toast options
const defaultToastOptions: ToastOptions = {
  position: 'top-right',
  duration: 3000,
  style: {
    background: '#1F2937', // Dark gray background
    color: 'white',
  },
};

/**
 * A wrapper object for `react-hot-toast` to provide simplified and consistent toast notifications.
 */
export const showToast = {
  /**
   * Displays a success toast notification.
   * @param {string} message - The message to display.
   * @param {ToastOptions} [options] - Optional toast options to override defaults.
   */
  success(message: string, options?: ToastOptions): string {
    return toast.success(message, {
      ...defaultToastOptions,
      icon: '✅',
      style: {
        background: '#10B981', // Green background
        color: 'white',
      },
      ...options,
    });
  },

  /**
   * Displays an error toast notification.
   * @param {string} message - The message to display.
   * @param {ToastOptions} [options] - Optional toast options to override defaults.
   */
  error(message: string, options?: ToastOptions): string {
    return toast.error(message, {
      ...defaultToastOptions,
      icon: '❌',
      style: {
        background: '#EF4444', // Red background
        color: 'white',
      },
      ...options,
    });
  },

  /**
   * Displays a loading toast notification.
   * @param {string} message - The message to display.
   * @returns {string} The ID of the toast, which can be used to dismiss it.
   */
  loading(message: string, options?: ToastOptions): string {
    return toast.loading(message, {
      ...defaultToastOptions,
      icon: '⏳',
      style: {
        background: '#3B82F6', // Blue background
        color: 'white',
      },
      ...options,
    });
  },

  /**
   * Displays a promise-based toast notification that updates based on promise resolution.
   * @template T The type of the promise's resolved value.
   * @param {Promise<T>} promise - The promise to track.
   * @param {{ loading: string; success: string | ((data: T) => string); error: string | ((error: any) => string); }} messages - Messages for loading, success, and error states.
   * @param {ToastOptions} [options] - Optional toast options to override defaults.
   * @returns {Promise<T>} The original promise.
   */
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ): Promise<T> {
    return toast.promise(promise, messages, { ...defaultToastOptions, ...options });
  },

  /**
   * Dismisses a specific toast notification.
   * @param {string} toastId - The ID of the toast to dismiss.
   */
  dismiss(toastId: string): void {
    toast.dismiss(toastId);
  },

  /**
   * Displays a custom toast notification.
   * @param {ReactNode} component - The React component to render inside the toast.
   * @param {ToastOptions} [options] - Optional toast options to override defaults.
   */
  custom(component: ReactNode, options?: ToastOptions): string {
    return toast.custom(component as any, { ...defaultToastOptions, ...options });
  },
};

/**
 * The Toaster component from react-hot-toast.
 * Should be placed at the root of your application.
 */
export { Toaster };
