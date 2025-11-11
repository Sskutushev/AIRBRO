import React, { type ReactElement } from 'react';
import { render, type RenderOptions, type RenderResult, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext'; // Assuming ThemeProvider exists
import { AuthProvider } from '../context/AuthContext'; // Assuming AuthProvider exists
import { queryClient } from '../lib/queryClient'; // Assuming queryClient is configured
import { beforeAll, afterEach, afterAll } from 'vitest'; // Import vitest hooks
import { worker } from '../mocks/browser'; // Import MSW worker

// Start MSW worker before all tests
beforeAll(() => worker.listen());

// Reset any request handlers that might be added during a test,
// so they don't affect other tests.
afterEach(() => worker.resetHandlers());

// Clean up once the tests are finished.
afterAll(() => worker.stop());

/**
 * Custom render function that wraps components with common providers for testing.
 * @param ui The React element to render.
 * @param options Optional render options.
 * @returns {RenderResult} The result of the render function.
 */
const customRender = (
  ui: ReactElement,
  {
    route = '/',
    initialState = {}, // Placeholder for any initial state if needed
    ...renderOptions
  }: RenderOptions & { route?: string; initialState?: any } = {}
): RenderResult => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <MemoryRouter initialEntries={[route]}>
              <Routes>
                <Route path="*" element={children} />
              </Routes>
            </MemoryRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  };
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Utility to wait for loading states to finish.
 * Useful when testing components that fetch data asynchronously.
 */
const waitForLoadingToFinish = async () => {
  // You might need to adjust this based on your specific loading indicators
  // For example, waiting for a spinner to disappear or specific text to appear
  await waitFor(() => document.querySelector('.loading-spinner') === null, {
    timeout: 5000,
  });
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override the render method with our custom one
export { customRender as render, waitForLoadingToFinish };
