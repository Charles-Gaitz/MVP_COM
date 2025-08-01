import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  quality?: number;
  width?: number;
  height?: number;
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder,
  quality = 80,
  width,
  height 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Optimize image URL for better performance
  const optimizedSrc = optimizeImageUrl(src, { quality, width, height });
  
  // Create WebP version for modern browsers
  const webpSrc = src.includes('pexels.com') 
    ? src.replace(/\.(jpg|jpeg|png)/, '.webp')
    : optimizedSrc;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          {placeholder && (
            <div className="text-gray-400 text-sm">{placeholder}</div>
          )}
        </div>
      )}
      
      {/* Actual image - only load when in view */}
      {isInView && (
        <picture>
          {/* WebP for modern browsers */}
          <source srcSet={webpSrc} type="image/webp" />
          {/* Fallback for older browsers */}
          <img
            src={optimizedSrc}
            alt={alt}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            onLoad={handleLoad}
            loading="lazy"
            decoding="async"
            width={width}
            height={height}
          />
        </picture>
      )}
    </div>
  );
}

// Utility function to optimize image URLs
function optimizeImageUrl(url: string, options: { quality?: number; width?: number; height?: number }) {
  const { quality = 80, width, height } = options;
  
  if (url.includes('pexels.com')) {
    // Already optimized Pexels URLs - just ensure quality and size params
    let optimized = url;
    
    // Update quality if not already set
    if (!url.includes('&q=') && !url.includes('?q=')) {
      optimized += optimized.includes('?') ? `&q=${quality}` : `?q=${quality}`;
    }
    
    // Add responsive size parameters if provided
    if (width && height) {
      optimized = optimized.replace(/w=\d+&h=\d+/, `w=${width}&h=${height}`);
    }
    
    return optimized;
  }
  
  return url;
}

// Hook for preloading critical images
export function useImagePreload(urls: string[]) {
  useEffect(() => {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [urls]);
}
