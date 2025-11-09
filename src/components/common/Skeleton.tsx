/**
 * @file Skeleton components for displaying loading states resembling the content.
 * @module components/common/Skeleton
 */

import React from 'react';
// import { cn } from '../../lib/utils/cn'; // Assuming you have a utility for class name concatenation (e.g., clsx, classnames)

/**
 * Base props for all Skeleton components.
 */
interface SkeletonBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional custom class names. */
  className?: string;
  /** Width of the skeleton, e.g., '100px', '50%', or a number meaning pixels. */
  width?: string | number;
  /** Height of the skeleton, e.g., '20px', '1em', or a number meaning pixels. */
  height?: string | number;
  /** The visual variant of the skeleton. */
  variant?: 'text' | 'circular' | 'rectangular';
  /** The animation style of the skeleton. */
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Creates a utility function for concatenating class names.
 * If you have 'clsx' or 'classnames' installed, you should use that instead.
 * @param inputs - Class names to concatenate.
 * @returns {string} The concatenated class names.
 */
function classNames(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}

// Replace cn with classNames for now if you don't have a dedicated cn utility
// For a production app, it's recommended to use a robust utility like `clsx` or `classnames`

/**
 * The base Skeleton component.
 * Displays a placeholder loading state.
 */
export const Skeleton: React.FC<SkeletonBaseProps> = ({
  className,
  width,
  height,
  variant = 'rectangular',
  animation = 'pulse',
  style,
  ...props
}) => {
  const finalWidth = typeof width === 'number' ? `${width}px` : width;
  const finalHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      data-testid="skeleton-base"
      className={classNames(
        'bg-gray-300 dark:bg-gray-700',
        animation === 'pulse' && 'animate-pulse',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded',
        variant === 'text' && 'rounded-sm', // Slightly rounded for text-like appearance
        className
      )}
      style={{
        ...style,
        width: finalWidth,
        height: finalHeight,
      }}
      {...props}
    />
  );
};

// --- Specific Skeleton Templates ---

/**
 * A Skeleton component styled for text lines.
 */
interface SkeletonTextProps extends SkeletonBaseProps {
  /** Number of text lines to render. */
  lines?: number;
  /** Spacing between text lines. */
  spacing?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  spacing = 'my-2',
  className,
  ...props
}) => (
  <>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        data-testid="skeleton-text-line"
        className={classNames(spacing, className)}
        height={index === lines - 1 ? '1em' : '1.2em'} // Last line slightly shorter
        width={index === lines - 1 ? '80%' : '100%'} // Last line 80% width
        variant="text"
        {...props}
      />
    ))}
  </>
);

/**
 * A Skeleton component styled for avatars.
 */
interface SkeletonAvatarProps extends SkeletonBaseProps {
  /** Size of the avatar. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  className,
  ...props
}) => {
  let sizePx = 40; // md default
  if (size === 'sm') sizePx = 24;
  else if (size === 'lg') sizePx = 64;
  else if (size === 'xl') sizePx = 80;

  return (
    <Skeleton
      className={classNames(className)}
      width={sizePx}
      height={sizePx}
      variant="circular"
      {...props}
    />
  );
};

/**
 * A Skeleton component styled for a generic card.
 */
export const SkeletonCard: React.FC<SkeletonBaseProps> = ({ className }) => (
  <div
    className={classNames(
      'border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4',
      className
    )}
  >
    <Skeleton height={150} variant="rectangular" data-testid="skeleton-card-image" /> {/* Image placeholder */}
    <SkeletonText lines={2} spacing="my-1" data-testid="skeleton-card-text" /> {/* Title and description */}
    <Skeleton width="60%" height={24} variant="rectangular" /> {/* Price or category */}
    <Skeleton height={40} variant="rectangular" data-testid="skeleton-card-button" /> {/* Button */}
  </div>
);

/**
 * A Skeleton component specifically for product cards.
 */
export const ProductCardSkeleton: React.FC<SkeletonBaseProps> = ({ className }) => (
  <div
    className={classNames(
      'border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3',
      className
    )}
  >
    <Skeleton height={200} variant="rectangular" data-testid="skeleton-product-image" /> {/* Image skeleton */}
    <Skeleton height={20} width="80%" variant="text" data-testid="skeleton-product-title" /> {/* Title */}
    <Skeleton height={16} width="60%" variant="text" data-testid="skeleton-product-description" /> {/* Description */}
    <Skeleton height={24} width="40%" variant="rectangular" data-testid="skeleton-product-price" /> {/* Price */}
    <Skeleton height={40} className="rounded-md" variant="rectangular" data-testid="skeleton-product-button" /> {/* Button */}
  </div>
);

/**
 * A Skeleton component specifically for user profiles.
 */
export const UserProfileSkeleton: React.FC<SkeletonBaseProps> = ({ className }) => (
  <div className={classNames('p-6 space-y-5 flex flex-col items-center', className)}>
    <SkeletonAvatar size="xl" className="mx-auto" data-testid="skeleton-user-avatar" /> {/* Avatar */}
    <Skeleton height={28} width="60%" variant="text" data-testid="skeleton-user-name" /> {/* Name */}
    <Skeleton height={20} width="50%" variant="text" data-testid="skeleton-user-email" /> {/* Email */}
    <SkeletonText lines={3} spacing="my-0.5" className="text-center" data-testid="skeleton-user-bio" /> {/* Bio */}
  </div>
);
