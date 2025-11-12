// src/test/setup.ts
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:5173',
    assign: vi.fn(),
    replace: vi.fn(),
  },
  writable: true,
});

// Mock ResizeObserver
class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.ResizeObserver = ResizeObserver;

// Mock IntersectionObserver
function IntersectionObserverMock(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) {
  return {
    root: null,
    rootMargin: '0px',
    thresholds: [0],
    callback,
    options,
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: () => [],
  };
}

// Create a proper constructor 
Object.defineProperty(IntersectionObserverMock, 'prototype', {
  value: {
    constructor: IntersectionObserverMock,
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: () => [],
  },
});

// Properly assign IntersectionObserver to window with better typing
Object.assign(window, { IntersectionObserver: IntersectionObserverMock as any });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});