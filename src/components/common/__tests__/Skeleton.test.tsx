/**
 * @file Integration tests for the Skeleton components.
 * @module components/common/__tests__/Skeleton.test
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  ProductCardSkeleton,
  UserProfileSkeleton,
} from '../Skeleton';
import { describe, it, expect } from 'vitest';

describe('Skeleton Components', () => {
  describe('Skeleton (Base Component)', () => {
    it('should render with default styles', () => {
      render(<Skeleton />);
      const skeleton = screen.getByTestId('skeleton-base');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('bg-gray-300 dark:bg-gray-700 animate-pulse');
      expect(skeleton).toHaveClass('rounded'); // Default variant is rectangular
    });

    it('should apply custom width and height', () => {
      render(<Skeleton width="100px" height="50px" />);
      const skeleton = screen.getByTestId('skeleton-base');
      expect(skeleton).toHaveStyle('width: 100px');
      expect(skeleton).toHaveStyle('height: 50px');
    });

    it('should render circular variant', () => {
      render(<Skeleton variant="circular" />);
      const skeleton = screen.getByTestId('skeleton-base');
      expect(skeleton).toHaveClass('rounded-full');
    });

    it('should render text variant', () => {
      render(<Skeleton variant="text" />);
      const skeleton = screen.getByTestId('skeleton-base');
      expect(skeleton).toHaveClass('rounded-sm');
      // The base Skeleton component doesn't have a default height for text variant,
      // it's usually set by SkeletonText. So, remove this expectation.
      // expect(skeleton).toHaveStyle('height: 1em');
    });

    it('should apply custom class names', () => {
      render(<Skeleton className="custom-skeleton" />);
      expect(screen.getByTestId('skeleton-base')).toHaveClass('custom-skeleton');
    });

    it('should disable animation', () => {
      render(<Skeleton animation="none" />); // animation prop expects 'pulse' | 'wave' | 'none'
      expect(screen.getByTestId('skeleton-base')).not.toHaveClass('animate-pulse');
    });
  });

  describe('SkeletonText', () => {
    it('should render multiple lines of text skeletons', () => {
      render(<SkeletonText lines={3} />);
      const textSkeletons = screen.getAllByTestId('skeleton-text-line');
      expect(textSkeletons).toHaveLength(3);
      expect(textSkeletons[0]).toHaveStyle('width: 100%');
      expect(textSkeletons[1]).toHaveStyle('width: 100%');
      expect(textSkeletons[2]).toHaveStyle('width: 80%'); // Last line is 80% width
    });

    it('should apply custom class names', () => {
      render(<SkeletonText className="custom-text-skeleton" />);
      expect(screen.getAllByTestId('skeleton-text-line')[0]).toHaveClass('custom-text-skeleton');
    });
  });

  describe('SkeletonAvatar', () => {
    it('should render a circular avatar skeleton with default size', () => {
      render(<SkeletonAvatar />);
      const avatar = screen.getByTestId('skeleton-base');
      expect(avatar).toHaveClass('rounded-full');
      expect(avatar).toHaveStyle('width: 40px');
      expect(avatar).toHaveStyle('height: 40px');
    });

    it('should render with specified size', () => {
      render(<SkeletonAvatar size="lg" />);
      const avatar = screen.getByTestId('skeleton-base');
      expect(avatar).toHaveClass('rounded-full');
      expect(avatar).toHaveStyle('width: 64px');
      expect(avatar).toHaveStyle('height: 64px');
    });
  });

  describe('SkeletonCard', () => {
    it('should render a generic card skeleton', () => {
      render(<SkeletonCard />);
      expect(screen.getByTestId('skeleton-card-image')).toBeInTheDocument();
      expect(screen.getAllByTestId('skeleton-card-text').length).toBeGreaterThan(0); // Use getAllByTestId
      expect(screen.getByTestId('skeleton-card-button')).toBeInTheDocument();
    });
  });

  describe('ProductCardSkeleton', () => {
    it('should render a product card skeleton', () => {
      render(<ProductCardSkeleton />);
      expect(screen.getByTestId('skeleton-product-image')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-product-title')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-product-description')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-product-price')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-product-button')).toBeInTheDocument();
    });
  });

  describe('UserProfileSkeleton', () => {
    it('should render a user profile skeleton', () => {
      render(<UserProfileSkeleton />);
      expect(screen.getByTestId('skeleton-user-avatar')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-user-name')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-user-email')).toBeInTheDocument();
      expect(screen.getAllByTestId('skeleton-user-bio').length).toBeGreaterThan(0);
    });
  });
});
