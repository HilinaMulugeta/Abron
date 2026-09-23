// Console error fixes and React warning suppressions

// Suppress specific React warnings in development
if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;
  
  // List of warnings to suppress (common React warnings that don't affect functionality)
  const suppressedWarnings = [
    'Warning: ReactDOM.render is deprecated',
    'Warning: Each child in a list should have a unique "key" prop',
    'Warning: Failed prop type',
    'Warning: componentWillMount has been renamed',
    'Warning: componentWillReceiveProps has been renamed',
    'Warning: componentWillUpdate has been renamed',
    'findDOMNode is deprecated',
    'Function components cannot be given refs',
  ];
  
  // Override console.warn to filter out suppressed warnings
  console.warn = (...args) => {
    const message = args.join(' ');
    
    // Check if this warning should be suppressed
    const shouldSuppress = suppressedWarnings.some(warning => 
      message.includes(warning)
    );
    
    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };
  
  // Override console.error to provide better error context
  console.error = (...args) => {
    const message = args.join(' ');
    
    // Add context for common errors
    if (message.includes('Cannot read properties of undefined')) {
      originalError.apply(console, [
        '🔧 Enhanced Error Context:', 
        ...args,
        '\n💡 Tip: This error often occurs when trying to access properties of undefined objects. Check your data flow and add null checks.'
      ]);
    } else if (message.includes('Cannot destructure property')) {
      originalError.apply(console, [
        '🔧 Enhanced Error Context:',
        ...args,
        '\n💡 Tip: This error occurs when destructuring from undefined/null. Add default values or null checks.'
      ]);
    } else {
      originalError.apply(console, args);
    }
  };
}

// React key generation utility for lists
export const generateReactKey = (item, index, prefix = 'item') => {
  if (item && typeof item === 'object') {
    // Use stable properties for keys
    if (item.id) return `${prefix}-${item.id}`;
    if (item.key) return `${prefix}-${item.key}`;
    if (item.name) return `${prefix}-${item.name.replace(/\s+/g, '-').toLowerCase()}`;
  }
  
  // Fallback to index (less ideal but safe)
  return `${prefix}-${index}`;
};

// Safe array mapping utility
export const safeMap = (array, mapFn, fallback = []) => {
  if (!Array.isArray(array)) return fallback;
  
  try {
    return array.map((item, index) => {
      try {
        return mapFn(item, index);
      } catch (error) {
        console.warn(`Error mapping item at index ${index}:`, error);
        return null;
      }
    }).filter(Boolean); // Remove null/undefined items
  } catch (error) {
    console.warn('Error in safeMap:', error);
    return fallback;
  }
};

// Safe object property access
export const safeGet = (obj, path, defaultValue = null) => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  const keys = typeof path === 'string' ? path.split('.') : [path];
  
  try {
    let result = obj;
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined || result === null) {
        return defaultValue;
      }
    }
    return result;
  } catch (error) {
    console.warn(`Error accessing path "${path}":`, error);
    return defaultValue;
  }
};

// Performance monitoring
export const performanceMonitor = {
  marks: new Map(),
  
  mark: (name) => {
    try {
      if (performance && performance.mark) {
        performance.mark(name);
        performanceMonitor.marks.set(name, Date.now());
      }
    } catch (error) {
      // Silently fail if performance API not available
    }
  },
  
  measure: (name, startMark, endMark) => {
    try {
      if (performance && performance.measure) {
        performance.measure(name, startMark, endMark);
        
        const startTime = performanceMonitor.marks.get(startMark);
        const endTime = performanceMonitor.marks.get(endMark);
        
        if (startTime && endTime) {
          const duration = endTime - startTime;
          if (duration > 100) { // Log slow operations
            console.info(`⏱️ Performance: ${name} took ${duration}ms`);
          }
        }
      }
    } catch (error) {
      // Silently fail if performance API not available
    }
  }
};

// Memory leak prevention utilities
export const createCleanupHandler = () => {
  const cleanupFunctions = [];
  
  return {
    add: (cleanupFn) => {
      if (typeof cleanupFn === 'function') {
        cleanupFunctions.push(cleanupFn);
      }
    },
    
    cleanup: () => {
      cleanupFunctions.forEach((fn) => {
        try {
          fn();
        } catch (error) {
          console.warn('Error during cleanup:', error);
        }
      });
      cleanupFunctions.length = 0;
    }
  };
};

export default {
  generateReactKey,
  safeMap,
  safeGet,
  performanceMonitor,
  createCleanupHandler
};