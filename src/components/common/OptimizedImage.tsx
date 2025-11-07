import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Генерируем пути для разных форматов
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp');
  const avifSrc = src.replace(/\.(jpg|jpeg|png)$/, '.avif');

  if (error) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width, height }} >
        <span className="text-gray-400">Ошибка загрузки</span>
      </div>
    );
  }

  return (
    <picture>
      <source srcSet={avifSrc} type="image/avif" />
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </picture>
  );
};
