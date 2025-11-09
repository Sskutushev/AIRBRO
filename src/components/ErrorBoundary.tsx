import React from 'react';
import type { ReactNode } from 'react';
import type { ErrorInfo } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { logError } from '../lib/monitoring/sentry';

interface ErrorBoundaryProps {
  /** The content to render when there is no error. */
  children: ReactNode;
  /** An optional custom component to render when an error is caught. */
  fallback?: React.ComponentType<{ error: Error; onReset: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * A component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * This lifecycle method is invoked after an error has been thrown by a descendant component.
   * It receives the error that was thrown as a parameter and should return a value to update state.
   * @param error The error that was thrown.
   * @returns An object to update the state.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * This lifecycle method is invoked after an error has been thrown by a descendant component.
   * It is a good place for logging errors.
   * @param error The error that was thrown.
   * @param errorInfo An object with a `componentStack` key containing information about which component threw the error.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // In a real production environment, you would log this to a service like Sentry.
    if (import.meta.env.MODE === 'production') {
      logError(error, { componentStack: errorInfo.componentStack });
    }
  }

  /**
   * Resets the error state. In a real-world scenario, this might involve
   * more complex logic, but here we simply reload the page for a fresh start.
   */
  private handleReset = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // If a custom fallback component is provided, render it.
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.error} onReset={this.handleReset} />;
      }

      // Otherwise, render the default fallback UI.
      return (
        <div
          className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full space-y-6 text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Что-то пошло не так
            </h2>

            {/* Display detailed error message only in development for debugging */}
            {import.meta.env.DEV && (
              <div className="text-left bg-red-50 dark:bg-gray-700 p-3 rounded-md text-red-700 dark:text-red-200 text-xs overflow-auto">
                <p className="font-semibold mb-1">Error Details:</p>
                <pre className="whitespace-pre-wrap break-words">{this.state.error.message}</pre>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
