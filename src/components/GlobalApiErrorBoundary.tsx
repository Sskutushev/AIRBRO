import React, { Component, ErrorInfo, ReactNode } from 'react';
import { showToast } from '../lib/toast'; // Assuming showToast is available

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class GlobalApiErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in GlobalApiErrorBoundary:', error, errorInfo);
    showToast.error('An unexpected error occurred. Please try again later.');
    // You can also log the error to an error reporting service here
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary text-text-primary">
          <h1 className="text-4xl font-bold mb-4">Something went wrong.</h1>
          <p className="text-lg mb-8">
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-telegram text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalApiErrorBoundary;
