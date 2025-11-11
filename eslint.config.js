import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    // Global ignores for the entire project
    ignores: [
      'dist', 
      'node_modules', 
      'backend/dist', 
      'api/dist', 
      'eslint.config.js',
      'postcss.config.js',
      'tailwind.config.js',
      'vite.config.ts',
      'playwright.config.ts',
      'backend/vitest.config.ts',
      'backend/vite.config.ts',
      'scripts/**',
      'backend/scripts/**',
      'backend/getChatId.ts',
      'backend/prisma/**'
    ],
  },
  // Frontend application files
  {
    files: ['src/**/*.{ts,tsx}', '!src/**/*.{test,spec}.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Additional frontend-specific rules
      '@typescript-eslint/no-explicit-any': 'warn', // Allow 'any' with a warning
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn on unused vars, ignore args starting with _
      'react-hooks/exhaustive-deps': 'warn', // Warn on missing dependencies in hooks
      'react-hooks/rules-of-hooks': 'error', // Enforce rules of hooks
      'react-hooks/set-state-in-effect': 'warn', // Warn on setState in effect
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.app.json', // Frontend tsconfig
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Test files
  {
    files: ['src/**/*.{test,spec}.{ts,tsx}', 'e2e/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Additional test-specific rules
      '@typescript-eslint/no-explicit-any': 'warn', // Allow 'any' with a warning
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn on unused vars, ignore args starting with _
      'react-hooks/exhaustive-deps': 'off', // Disable exhaustive deps for tests
      'react-hooks/rules-of-hooks': 'off', // Disable rules of hooks for tests
      'react-hooks/set-state-in-effect': 'warn', // Warn on setState in effect
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.vitest,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.test.json', './tsconfig.e2e.json'], // Use both test and e2e tsconfig
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Backend files
  {
    files: ['backend/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: './backend/tsconfig.json', // Backend tsconfig
      },
    },
  },
  // API files
  {
    files: ['api/**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: './api/tsconfig.json', // API tsconfig
      },
    },
  },
  // Root Node.js config files (vite.config.ts, vitest.config.ts, playwright.config.ts)
  {
    files: ['vite.config.ts', 'vitest.config.ts', 'playwright.config.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.node.json', // Node-specific tsconfig
      },
    },
  },
  // Backend test files
  {
    files: [
      'backend/**/*.{test,spec}.{ts,tsx}',
      'backend/jest.config.ts',
      'backend/jest.setup.ts',
      'backend/jest.setup.env.ts' // Add this line
    ],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' in test files
      '@typescript-eslint/no-unused-vars': 'off', // Allow unused vars in test files
      'no-empty-pattern': 'off', // Allow empty patterns in test files
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest, // Add Jest globals for test files
      },
      parser: tseslint.parser,
      parserOptions: {
        project: './backend/tsconfig.test.json', // Use the dedicated backend test tsconfig
      },
    },
  },
])