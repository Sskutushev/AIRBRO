/**
 * @file Integration tests for the OptimizedImage component.
 * @module components/common/__tests__/OptimizedImage.test
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { OptimizedImage } from '../OptimizedImage';
import { vi, beforeEach, afterEach, expect } from 'vitest';

// Mock framer-motion's useInView and motion components
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return {
    ...actual,
    useInView: vi.fn(() => true), // Always in view for testing purposes
    motion: {
      div: vi.fn(({ children }) => <div>{children}</div>),
      img: vi.fn(({ children, ...props }) => <img {...props}>{children}</img>),
      picture: vi.fn(({ children, ...props }) => <picture {...props}>{children}</picture>),
    },
  };
});

describe('OptimizedImage', () => {
  const src = '/images/test.jpg';
  const alt = 'Test Image';
  const widths = [320, 640, 1024];

  beforeEach(() => {
    // No global Image mock needed here, will simulate events directly
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render a picture element with source tags for AVIF and WebP', () => {
    render(<OptimizedImage src={src} alt={alt} widths={widths} />);

    const pictureElement = screen.getByRole('img').closest('picture');
    expect(pictureElement).toBeInTheDocument();

    const sources = screen.getAllByTestId('optimized-image-source');
    expect(sources).toHaveLength(2); // Only 2 source tags (avif, webp)

    // Check for AVIF source
    expect(sources[0]).toHaveAttribute('type', 'image/avif');
    expect(sources[0]).toHaveAttribute(
      'srcset',
      expect.stringContaining('/images/test-320w.avif 320w')
    );

    // Check for WebP source
    expect(sources[1]).toHaveAttribute('type', 'image/webp');
    expect(sources[1]).toHaveAttribute(
      'srcset',
      expect.stringContaining('/images/test-320w.webp 320w')
    );
  });

  it('should render an img element with correct attributes', () => {
    render(<OptimizedImage src={src} alt={alt} widths={widths} />);

    const imgElement = screen.getByRole('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', src);
    expect(imgElement).toHaveAttribute('alt', alt);
    expect(imgElement).toHaveAttribute('loading', 'lazy');
    expect(imgElement).toHaveAttribute('sizes', '100vw'); // Default sizes
  });

  it('should apply custom sizes if provided', () => {
    const customSizes = '(max-width: 1200px) 80vw, 60vw';
    render(<OptimizedImage src={src} alt={alt} widths={widths} sizes={customSizes} />);
    expect(screen.getByRole('img')).toHaveAttribute('sizes', customSizes);
  });

  it('should set loading to "eager" if priority is true', () => {
    render(<OptimizedImage src={src} alt={alt} widths={widths} priority />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager');
  });

  it('should display a placeholder while loading', () => {
    render(<OptimizedImage src={src} alt={alt} widths={widths} />);
    expect(screen.getByTestId('optimized-image-placeholder')).toBeInTheDocument();
  });

  it('should remove placeholder after image loads', async () => {
    render(<OptimizedImage src={src} alt={alt} widths={widths} />);
    const imgElement = screen.getByRole('img');
    fireEvent.load(imgElement); // Simulate image load

    await waitFor(() => {
      expect(screen.queryByTestId('optimized-image-placeholder')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should display error fallback if image fails to load', async () => {
    render(<OptimizedImage src={src} alt={alt} widths={widths} />);

    // Simulate image error
    const imgElement = screen.getByRole('img');
    fireEvent.error(imgElement);

    await waitFor(() => {
      expect(screen.getByTestId('optimized-image-error-fallback')).toBeInTheDocument();
    });
    expect(screen.getByRole('img')).toHaveClass('hidden'); // Image should be hidden
  });

  it('should handle aspect ratio correctly', () => {
    render(<OptimizedImage src={src} alt={alt} widths={widths} width={160} height={90} />);
    const container = screen.getByTestId('optimized-image-container');
    expect(container).toHaveStyle('padding-bottom: 56.25%'); // (90/160)*100
  });

  it('should apply custom class names', () => {
    render(<OptimizedImage src={src} alt={alt} widths={widths} className="custom-class" />);
    expect(screen.getByTestId('optimized-image-container')).toHaveClass('custom-class');
  });
});
