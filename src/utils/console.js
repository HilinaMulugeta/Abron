// Console utilities for development and production

// Environment detection with fallback
export const isDevelopment = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development';
export const isProduction = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production';

// Safe console methods that won't break in production
export const safeConsole = {
  log: (...args) => {
    if (isDevelopment && console.log) {
      console.log(...args);
    }
  },
  
  warn: (...args) => {
    if (console.warn) {
      console.warn(...args);
    }
  },
  
  error: (...args) => {
    if (console.error) {
      console.error(...args);
    }
  },
  
  info: (...args) => {
    if (isDevelopment && console.info) {
      console.info(...args);
    }
  },
  
  debug: (...args) => {
    if (isDevelopment && console.debug) {
      console.debug(...args);
    }
  },
  
  group: (label) => {
    if (isDevelopment && console.group) {
      console.group(label);
    }
  },
  
  groupEnd: () => {
    if (isDevelopment && console.groupEnd) {
      console.groupEnd();
    }
  },
  
  time: (label) => {
    if (isDevelopment && console.time) {
      console.time(label);
    }
  },
  
  timeEnd: (label) => {
    if (isDevelopment && console.timeEnd) {
      console.timeEnd(label);
    }
  }
};

// Performance logging
export const performanceLogger = {
  mark: (name) => {
    if (isDevelopment && performance?.mark) {
      performance.mark(name);
    }
  },
  
  measure: (name, startMark, endMark) => {
    if (isDevelopment && performance?.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        safeConsole.log(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`);
      } catch (error) {
        safeConsole.warn('Performance measurement failed:', error);
      }
    }
  }
};

// API call logging
export const apiLogger = {
  request: (method, url, data = null) => {
    if (isDevelopment) {
      safeConsole.group(`🌐 API ${method.toUpperCase()} ${url}`);
      if (data) {
        safeConsole.log('Request data:', data);
      }
      safeConsole.time(`api-${method}-${url}`);
    }
  },
  
  response: (method, url, data, duration) => {
    if (isDevelopment) {
      safeConsole.log('Response:', data);
      safeConsole.timeEnd(`api-${method}-${url}`);
      safeConsole.groupEnd();
    }
  },
  
  error: (method, url, error) => {
    safeConsole.error(`❌ API ${method.toUpperCase()} ${url} failed:`, error);
    if (isDevelopment) {
      safeConsole.groupEnd();
    }
  }
};

// Component lifecycle logging
export const componentLogger = {
  mount: (componentName) => {
    if (isDevelopment) {
      safeConsole.log(`🔄 ${componentName} mounted`);
    }
  },
  
  unmount: (componentName) => {
    if (isDevelopment) {
      safeConsole.log(`🔄 ${componentName} unmounted`);
    }
  },
  
  update: (componentName, props) => {
    if (isDevelopment) {
      safeConsole.log(`🔄 ${componentName} updated`, props);
    }
  },
  
  render: (componentName, renderCount) => {
    if (isDevelopment && renderCount > 5) {
      safeConsole.warn(`⚠️ ${componentName} has rendered ${renderCount} times - check for unnecessary re-renders`);
    }
  }
};

// Error boundary logging
export const errorLogger = {
  componentError: (error, errorInfo, componentStack) => {
    safeConsole.error('🚨 Component Error:', {
      error: error.message,
      stack: error.stack,
      componentStack,
      errorInfo
    });
    
    // In production, you might want to send this to an error reporting service
    if (isProduction) {
      // Example: sendToErrorService({ error, errorInfo, componentStack });
    }
  },
  
  promiseRejection: (event) => {
    safeConsole.error('🚨 Unhandled Promise Rejection:', event.reason);
    
    if (isProduction) {
      // Example: sendToErrorService({ type: 'unhandledRejection', reason: event.reason });
    }
  },
  
  globalError: (event) => {
    safeConsole.error('🚨 Global Error:', event.error);
    
    if (isProduction) {
      // Example: sendToErrorService({ type: 'globalError', error: event.error });
    }
  }
};

// Memory usage monitoring
export const memoryLogger = {
  checkUsage: () => {
    if (isDevelopment && performance?.memory) {
      const memory = performance.memory;
      const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      const limit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
      
      safeConsole.log(`💾 Memory: ${used}MB / ${total}MB (limit: ${limit}MB)`);
      
      if (used / limit > 0.8) {
        safeConsole.warn('⚠️ High memory usage detected');
      }
    }
  }
};

// Network logging
export const networkLogger = {
  online: () => {
    if (isDevelopment) {
      safeConsole.log('🌐 Network: Online');
    }
  },
  
  offline: () => {
    safeConsole.warn('🌐 Network: Offline');
  },
  
  slowConnection: (connectionType) => {
    if (connectionType && ['slow-2g', '2g'].includes(connectionType)) {
      safeConsole.warn('🐌 Slow network connection detected:', connectionType);
    }
  }
};

// Cleanup function to remove development logs in production
export const cleanupConsole = () => {
  if (isProduction) {
    // Override console methods in production if needed
    const noop = () => {};
    
    // Optionally disable console.log in production
    // console.log = noop;
    // console.debug = noop;
    // console.info = noop;
  }
};

// Initialize error listeners
export const initErrorListeners = () => {
  // Global error handler
  window.addEventListener('error', errorLogger.globalError);
  
  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', errorLogger.promiseRejection);
  
  // Network status listeners
  window.addEventListener('online', networkLogger.online);
  window.addEventListener('offline', networkLogger.offline);
  
  // Check connection type if available
  if (navigator.connection) {
    networkLogger.slowConnection(navigator.connection.effectiveType);
    
    navigator.connection.addEventListener('change', () => {
      networkLogger.slowConnection(navigator.connection.effectiveType);
    });
  }
};

// Remove error listeners (cleanup)
export const removeErrorListeners = () => {
  window.removeEventListener('error', errorLogger.globalError);
  window.removeEventListener('unhandledrejection', errorLogger.promiseRejection);
  window.removeEventListener('online', networkLogger.online);
  window.removeEventListener('offline', networkLogger.offline);
};