import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { showToast } from '../lib/toast';

interface ErrorContextType {
  error: Error | null;
  showError: (error: Error | string) => void;
  clearError: () => void;
  hasError: boolean;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  const showError = useCallback((errorInput: Error | string) => {
    const errorObj = typeof errorInput === 'string' ? new Error(errorInput) : errorInput;

    setError(errorObj);

    // Show toast notification
    showToast.error(errorObj.message || 'An unexpected error occurred');

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Global Error:', errorObj);
    }

    // Auto-clear error after 5 seconds
    setTimeout(() => {
      setError(null);
    }, 5000);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    error,
    showError,
    clearError,
    hasError: error !== null,
  };

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

// Higher-order component to wrap async functions with error handling
export const withErrorHandling = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  errorHandler?: (error: Error) => void
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));

      if (errorHandler) {
        errorHandler(errorObj);
      } else {
        showToast.error(errorObj.message || 'An error occurred');
      }

      return null;
    }
  };
};
