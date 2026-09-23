import { useState, useEffect, useCallback, useRef } from 'react';

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);
  
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    disabled = false
  } = options;
  
  useEffect(() => {
    const element = elementRef.current;
    
    if (!element || disabled || (triggerOnce && hasIntersected)) {
      return;
    }
    
    if (!window.IntersectionObserver) {
      // Fallback for browsers without IntersectionObserver
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);
        
        if (isElementIntersecting) {
          setHasIntersected(true);
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    );
    
    observerRef.current = observer;
    observer.observe(element);
    
    return () => {
      if (observer) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, disabled, hasIntersected]);
  
  return {
    elementRef,
    isIntersecting,
    hasIntersected
  };
};

// Lazy image loading hook
export const useLazyImage = (src, options = {}) => {
  const [imageSrc, setImageSrc] = useState(options.placeholder || '');
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver(options);
  
  useEffect(() => {
    if (!hasIntersected || !src) return;
    
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
      setImageError(false);
    };
    
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };
    
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, hasIntersected]);
  
  return {
    elementRef,
    imageSrc,
    imageError,
    imageLoaded,
    hasIntersected
  };
};

// Infinite scroll hook
export const useInfiniteScroll = (callback, options = {}) => {
  const [isFetching, setIsFetching] = useState(false);
  const { 
    threshold = 0.1,
    rootMargin = '100px',
    disabled = false 
  } = options;
  
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: false,
    disabled: disabled || isFetching
  });
  
  useEffect(() => {
    if (!isIntersecting || isFetching || disabled) return;
    
    setIsFetching(true);
    
    const executeCallback = async () => {
      try {
        await callback();
      } catch (error) {
        console.error('Infinite scroll callback error:', error);
      } finally {
        setIsFetching(false);
      }
    };
    
    executeCallback();
  }, [isIntersecting, isFetching, disabled, callback]);
  
  return {
    elementRef,
    isFetching,
    isIntersecting
  };
};

// Virtual scrolling hook for large lists
export const useVirtualScroll = (items = [], itemHeight = 50, containerHeight = 400) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState(null);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length - 1
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
    ...item,
    index: startIndex + index
  }));
  
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  const handleScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  useEffect(() => {
    const container = containerRef;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, handleScroll]);
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setContainerRef,
    scrollTop
  };
};

// Lazy component loading hook
export const useLazyComponent = (importFunc, fallback = null) => {
  const [Component, setComponent] = useState(() => fallback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  const loadComponent = useCallback(async () => {
    if (Component && Component !== fallback) return Component;
    
    try {
      setLoading(true);
      setError(null);
      
      const module = await importFunc();
      const LoadedComponent = module.default || module;
      
      if (mountedRef.current) {
        setComponent(() => LoadedComponent);
        setLoading(false);
      }
      
      return LoadedComponent;
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
        setLoading(false);
      }
      throw err;
    }
  }, [Component, fallback, importFunc]);
  
  return {
    Component,
    loading,
    error,
    loadComponent
  };
};

// Pagination hook
export const usePagination = (totalItems, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  const goToPage = useCallback((page) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(targetPage);
  }, [totalPages]);
  
  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);
  
  const goToPrevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevPage]);
  
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);
  
  // Generate page numbers for pagination controls
  const getPageNumbers = useCallback((maxVisible = 5) => {
    const pages = [];
    const halfVisible = Math.floor(maxVisible / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages]);
  
  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    goToPage,
    goToNextPage,
    goToPrevPage,
    reset,
    getPageNumbers,
    // Utility properties
    itemsPerPage,
    totalItems
  };
};

// Load more pattern hook (alternative to infinite scroll)
export const useLoadMore = (initialItems = [], pageSize = 10) => {
  const [items, setItems] = useState(initialItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  const loadMore = useCallback(async (loadFunction) => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const newItems = await loadFunction(currentPage + 1, pageSize);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setCurrentPage(prev => prev + 1);
        
        if (newItems.length < pageSize) {
          setHasMore(false);
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, loading, hasMore]);
  
  const reset = useCallback(() => {
    setItems(initialItems);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
    setLoading(false);
  }, [initialItems]);
  
  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
    currentPage
  };
};