/**
 * @file OptimizedImage component for rendering responsive and optimized images.
 * @module components/common/OptimizedImage
 */

import React, { useState, useEffect, useRef } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';

/**
 * Props for the OptimizedImage component.
 */
interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** The source URL of the original image. */
  src: string;
  /** The alternative text for the image, crucial for accessibility. */
  alt: string;
  /** Optional CSS class names to apply to the image wrapper. */
  className?: string;
  /** The desired width of the image. Used for responsive sizing and placeholder. */
  width?: number;
  /** The desired height of the image. Used for responsive sizing and placeholder. */
  height?: number;
  /** If true, the image will be loaded immediately (not lazy-loaded). */
  priority?: boolean;
  /** Optional sizes attribute for responsive images. */
  sizes?: string;
  /** Optional srcSet for responsive images. If not provided, it will be generated based on src. */
  srcSet?: string;
}

/**
 * Generates a responsive srcSet for WebP and AVIF formats based on the original source.
 * This is a placeholder and assumes a naming convention from an image optimization script.
 * @param originalSrc The original image source.
 * @param widths An array of desired widths for responsive images.
 * @returns A string for the srcset attribute.
 */
const generateSrcSet = (originalSrc: string, widths: number[]): string => {
  const baseName = originalSrc.substring(0, originalSrc.lastIndexOf('.'));
  const ext = originalSrc.substring(originalSrc.lastIndexOf('.'));

  const webpSrcSet = widths.map((w) => `${baseName}-${w}w.webp ${w}w`).join(', ');
  const avifSrcSet = widths.map((w) => `${baseName}-${w}w.avif ${w}w`).join(', ');
  const originalSrcSet = widths.map((w) => `${baseName}-${w}w${ext} ${w}w`).join(', ');

  return `${avifSrcSet}, ${webpSrcSet}, ${originalSrcSet}`;
};

/**
 * A React component for rendering optimized and responsive images.
 * It supports AVIF/WebP formats, lazy loading, responsive sizes, and loading/error states.
 *
 * @param {OptimizedImageProps} props - The properties for the component.
 * @returns {JSX.Element} An image element wrapped in a picture tag with optimization features.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  sizes,
  srcSet,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Default responsive widths
  const defaultWidths = [320, 640, 1024, 1920];

  // Generate srcSet if not provided
  const finalSrcSet = srcSet || generateSrcSet(src, defaultWidths);

  useEffect(() => {
    // Use ref to track if component is mounted
    let isMounted = true;

    const img = imgRef.current;
    if (img?.complete && isMounted) {
      setLoaded(true);
    }

    return () => {
      isMounted = false;
    };
  }, [src]);

  const handleLoad = () => {
    setLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true); // Still mark as loaded to hide placeholder
  };

  const aspectRatio = width && height ? `${(height / width) * 100}%` : 'auto';

  return (
    <div
      data-testid="optimized-image-container"
      className={`relative overflow-hidden ${className || ''}`}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        paddingBottom: aspectRatio !== 'auto' ? aspectRatio : undefined,
      }}
    >
      {/* Placeholder / Loading State */}
      {!loaded && !error && (
        <div
          data-testid="optimized-image-placeholder"
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{ paddingBottom: aspectRatio }}
        />
      )}

      {/* Error State */}
      {error && (
        <div
          data-testid="optimized-image-error-fallback"
          className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
        >
          <ImageOff className="w-8 h-8" />
        </div>
      )}

      {/* Image Element */}
      <motion.picture
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded && !error ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0"
      >
        {/* AVIF source */}
        <source
          data-testid="optimized-image-source"
          type="image/avif"
          srcSet={finalSrcSet.replace(/\.webp/g, '.avif').replace(/\.jpg|\.jpeg|\.png/g, '.avif')}
          sizes={sizes || (width ? `${width}px` : '100vw')}
        />
        {/* WebP source */}
        <source
          data-testid="optimized-image-source"
          type="image/webp"
          srcSet={finalSrcSet.replace(/\.jpg|\.jpeg|\.png/g, '.webp')}
          sizes={sizes || (width ? `${width}px` : '100vw')}
        />
        {/* Fallback image */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          className={`object-cover w-full h-full ${loaded && !error ? '' : 'hidden'}`}
          sizes={sizes || (width ? `${width}px` : '100vw')} // Pass sizes to img element
          {...rest}
        />
      </motion.picture>
    </div>
  );
};
