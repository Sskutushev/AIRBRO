/**
 * @file Vitest configuration file.
 * @module vitest.config
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false, // Disable CSS processing for tests
    exclude: [
      '**/node_modules/**',
      'dist/',
      'e2e/',
      'e2e/**/*.spec.ts',
      'src/test/setup.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '__tests__/', // Exclude test utility folders
        '**/*.test.ts', // Exclude test files themselves from coverage
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        'src/main.tsx', // Entry point, often not fully testable
        'src/App.tsx', // Root component, often contains routing/providers
        'src/lib/analytics/', // External integration
        'src/lib/toast.ts', // Wrapper for external library
        'src/lib/queryClient.ts', // Configuration file
        'src/context/', // Context providers
        'src/types/', // Type definitions
        'src/services/api/client.ts', // API client, tested via integration tests
        'src/hooks/useAuth.ts', // Covered by integration tests
        'src/hooks/useProducts.ts', // Covered by integration tests
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
