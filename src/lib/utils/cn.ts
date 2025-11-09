/**
 * @file Utility function for conditionally joining Tailwind CSS classes together.
 * @module lib/utils/cn
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditionally joins Tailwind CSS classes together, handling conflicts and merging them efficiently.
 * This utility is a wrapper around `clsx` and `tailwind-merge`.
 *
 * @param {...ClassValue[]} inputs - A list of class values (strings, objects, arrays) to join.
 * @returns {string} The merged and optimized Tailwind CSS class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
