/**
 * @file Unit tests for the `cn` utility function.
 * @module lib/utils/__tests__/cn.test
 */

import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn utility function', () => {
  it('should correctly merge simple class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional class names', () => {
    expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
  });

  it('should merge objects of class names', () => {
    expect(cn({ class1: true, class2: false, class3: true })).toBe('class1 class3');
  });

  it('should handle arrays of class names', () => {
    expect(cn(['class1', 'class2'], ['class3'])).toBe('class1 class2 class3');
  });

  it('should resolve Tailwind CSS conflicts', () => {
    expect(cn('p-4', 'p-6', 'bg-red-500', 'bg-blue-500')).toBe('p-6 bg-blue-500');
  });

  it('should handle mixed inputs', () => {
    expect(cn('text-lg', { 'font-bold': true }, ['p-2', 'm-4'], 'text-xl')).toBe(
      'font-bold p-2 m-4 text-xl'
    );
  });

  it('should return an empty string if no inputs are provided', () => {
    expect(cn()).toBe('');
  });

  it('should filter out falsy values', () => {
    expect(cn('class1', null, undefined, 0, '', 'class2')).toBe('class1 class2');
  });

  it('should handle complex Tailwind conflicts', () => {
    expect(cn('px-2 py-1', 'p-3', 'text-red-500', 'text-green-500', 'font-medium')).toBe(
      'p-3 text-green-500 font-medium'
    );
  });
});
