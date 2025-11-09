/**
 * @file Manual mock for the Sentry monitoring module.
 * @module lib/monitoring/__mocks__/sentry
 */
import { vi } from 'vitest';

export const mockLogError = vi.fn();

export const logError = mockLogError;
