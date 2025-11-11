/**
 * @file Configuration for TanStack Query's QueryClient.
 * @module lib/queryClient
 */

import { QueryClient } from '@tanstack/react-query';
import { showToast } from './toast'; // Import showToast

/**
 * Configured instance of QueryClient for TanStack Query.
 * Defines default options for queries and mutations.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      gcTime: 1000 * 60 * 10, // Data stays in cache for 10 minutes
      retry: 1, // Retry failed queries once
      refetchOnWindowFocus: true, // Refetch data when window regains focus
    },
    mutations: {
      retry: 0, // Do not retry mutations by default
    },
  },
});
