import React from 'react';
import { useLazyImage } from '../hooks/useLazyLoading';

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = '',
  fallback = null,
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  ...props
}) => {
  const {
    elementRef,
    imageSrc,
    imageError,
    imageLoaded,
    hasIntersected
  } = useLazyImage(src, {
    placeholder,
    threshold,
    rootMargin,
    triggerOnce: true
  });
  
  // Handle load callback
  React.useEffect(() => {
    if (imageLoaded && onLoad) {
      onLoad();
    }
  }, [imageLoaded, onLoad]);
  
  // Handle error callback
  React.useEffect(() => {
    if (imageError && onError) {
      onError();
    }
  }, [imageError, onError]);
  
  // Show fallback if error and fallback provided
  if (imageError && fallback) {
    return fallback;
  }
  
  // Default error fallback
  if (imageError) {
    return (
      <div 
        ref={elementRef}
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        {...props}
      >
        <div className="text-gray-400 text-center p-4">
          <svg 
            className="w-8 h-8 mx-auto mb-2" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
              clipRule="evenodd" 
            />
          </svg>
          <p className="text-xs">Failed to load image</p>
        </div>
      </div>
    );
  }
  
  return (
    <div ref={elementRef} className="relative">
      {/* Placeholder/Loading state */}
      {(!hasIntersected || !imageLoaded) && (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
          {...props}
        >
          {placeholder && (
            <img
              src={placeholder}
              alt=""
              className={`w-full h-full object-cover opacity-50 ${className}`}
            />
          )}
          {!placeholder && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}
      
      {/* Actual image */}
      {hasIntersected && (
        <img
          src={imageSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={() => {
            // Additional onLoad handling if needed
          }}
          onError={() => {
            // Additional onError handling if needed
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;