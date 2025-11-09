/**
 * @file Integration tests for the ErrorBoundary component.
 * @module components/__tests__/ErrorBoundary.test
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import { vi, beforeEach, afterEach, expect } from 'vitest';
import { mockLogError } from '../../lib/monitoring/sentry';

// Use the manual mock
vi.mock('../../lib/monitoring/sentry');

// A component that throws an error
const ProblemChild = () => {
  throw new Error('Test error from ProblemChild');
};

describe('ErrorBoundary', () => {
  const originalError = console.error;
  const originalLocation = window.location;
  let errorSpy: ReturnType<typeof vi.spyOn>;
  const mockReload = vi.fn();

  beforeEach(() => {
    // Suppress React error messages in test output
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockLogError.mockClear();

    // Mock window.location.reload
    delete (window as any).location;
    (window as any).location = { ...originalLocation, reload: mockReload };
    mockReload.mockClear();
  });

  afterEach(() => {
    errorSpy.mockRestore();
    // Restore original console.error and window.location
    console.error = originalError;
    window.location = originalLocation;
    vi.unstubAllEnvs(); // Unstub all environment variables after each test
  });

  it('should render children normally if no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Normal Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Normal Content')).toBeInTheDocument();
    expect(screen.queryByText('Что-то пошло не так')).not.toBeInTheDocument();
  });

  it('should catch errors and display fallback UI', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Перезагрузить страницу/i })).toBeInTheDocument();
  });

  it('should log error to Sentry in production mode', () => {
    vi.stubEnv('MODE', 'production'); // Stub MODE to 'production'

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(mockLogError).toHaveBeenCalledTimes(1);
    expect(mockLogError).toHaveBeenCalledWith(expect.any(Error), {
      componentStack: expect.any(String),
    });
  });

  it('should not log error to Sentry in development mode', () => {
    vi.stubEnv('MODE', 'development'); // Stub MODE to 'development'

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(mockLogError).not.toHaveBeenCalled();
  });

  it('should reload the page when "Reload Page" button is clicked', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /Перезагрузить страницу/i }));
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('should display custom fallback UI if provided', () => {
    const CustomFallback = ({ error }: { error: Error }) => (
      <div data-testid="custom-fallback">Custom Error: {error.message}</div>
    );

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.getByText('Custom Error: Test error from ProblemChild')).toBeInTheDocument();
    expect(screen.queryByText('Что-то пошло не так')).not.toBeInTheDocument();
  });
});
