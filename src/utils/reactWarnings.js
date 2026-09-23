// React warnings prevention and fixes
import React from 'react';

// Safe key generator for React lists
export const generateSafeKey = (item, index, prefix = 'item') => {
  if (item && typeof item === 'object') {
    // Try to use item's id first
    if (item.id) {
      return `${prefix}-${item.id}`;
    }
    
    // Try to use item's unique properties
    if (item.name && item.category) {
      return `${prefix}-${item.name}-${item.category}`.replace(/\s+/g, '-').toLowerCase();
    }
    
    // Fallback to index with a stable prefix
    return `${prefix}-${index}`;
  }
  
  // For primitive values
  return `${prefix}-${item}-${index}`;
};

// Prop validation helpers
export const propValidation = {
  // Check if required props are provided
  checkRequired: (props, requiredProps, componentName) => {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      requiredProps.forEach(prop => {
        if (props[prop] === undefined || props[prop] === null) {
          console.warn(
            `Warning: ${componentName} component requires prop "${prop}" but it was not provided.`
          );
        }
      });
    }
  },
  
  // Check prop types (basic validation)
  checkTypes: (props, propTypes, componentName) => {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      Object.entries(propTypes).forEach(([prop, expectedType]) => {
        const value = props[prop];
        if (value !== undefined && value !== null) {
          const actualType = typeof value;
          if (actualType !== expectedType) {
            console.warn(
              `Warning: ${componentName} component expected prop "${prop}" to be of type "${expectedType}" but got "${actualType}".`
            );
          }
        }
      });
    }
  }
};

// Memory leak prevention
export const memoryLeakPrevention = {
  // Cancel function for cleanup
  createCancelToken: () => {
    let isCancelled = false;
    
    return {
      cancel: () => {
        isCancelled = true;
      },
      isCancelled: () => isCancelled,
      throwIfCancelled: () => {
        if (isCancelled) {
          throw new Error('Operation was cancelled');
        }
      }
    };
  },
  
  // Debounce function to prevent excessive calls
  debounce: (func, delay) => {
    let timeoutId;
    let cancelToken = memoryLeakPrevention.createCancelToken();
    
    const debouncedFunction = (...args) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        if (!cancelToken.isCancelled()) {
          func(...args);
        }
      }, delay);
    };
    
    debouncedFunction.cancel = () => {
      clearTimeout(timeoutId);
      cancelToken.cancel();
    };
    
    return debouncedFunction;
  },
  
  // Throttle function to limit execution frequency
  throttle: (func, limit) => {
    let inThrottle;
    let cancelToken = memoryLeakPrevention.createCancelToken();
    
    const throttledFunction = (...args) => {
      if (!inThrottle && !cancelToken.isCancelled()) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
    
    throttledFunction.cancel = () => {
      cancelToken.cancel();
    };
    
    return throttledFunction;
  }
};

// Safe event handler creation
export const createSafeEventHandler = (handler, preventDefault = false, stopPropagation = false) => {
  return (event) => {
    try {
      if (preventDefault && event?.preventDefault) {
        event.preventDefault();
      }
      
      if (stopPropagation && event?.stopPropagation) {
        event.stopPropagation();
      }
      
      if (typeof handler === 'function') {
        return handler(event);
      }
    } catch (error) {
      console.error('Event handler error:', error);
    }
  };
};

// Safe state updater that checks if component is still mounted
export const createSafeStateUpdater = (setState, isMountedRef) => {
  return (newState) => {
    if (isMountedRef.current) {
      setState(newState);
    }
  };
};

// Cleanup helpers for useEffect
export const effectCleanup = {
  // Timer cleanup
  timer: (timerId) => () => {
    if (timerId) {
      clearTimeout(timerId);
      clearInterval(timerId);
    }
  },
  
  // Event listener cleanup
  eventListener: (element, event, handler, options) => () => {
    if (element && element.removeEventListener) {
      element.removeEventListener(event, handler, options);
    }
  },
  
  // Abort controller cleanup
  abortController: (controller) => () => {
    if (controller && controller.abort) {
      controller.abort();
    }
  },
  
  // Multiple cleanup functions
  multiple: (...cleanupFns) => () => {
    cleanupFns.forEach(cleanup => {
      if (typeof cleanup === 'function') {
        try {
          cleanup();
        } catch (error) {
          console.error('Cleanup function error:', error);
        }
      }
    });
  }
};

// Safe DOM operations
export const safeDom = {
  // Safely query selector
  querySelector: (selector, parent = document) => {
    try {
      return parent.querySelector(selector);
    } catch (error) {
      console.warn('querySelector error:', error);
      return null;
    }
  },
  
  // Safely get element by id
  getElementById: (id) => {
    try {
      return document.getElementById(id);
    } catch (error) {
      console.warn('getElementById error:', error);
      return null;
    }
  },
  
  // Safely add event listener
  addEventListener: (element, event, handler, options) => {
    try {
      if (element && element.addEventListener) {
        element.addEventListener(event, handler, options);
        return true;
      }
    } catch (error) {
      console.warn('addEventListener error:', error);
    }
    return false;
  },
  
  // Safely remove event listener
  removeEventListener: (element, event, handler, options) => {
    try {
      if (element && element.removeEventListener) {
        element.removeEventListener(event, handler, options);
        return true;
      }
    } catch (error) {
      console.warn('removeEventListener error:', error);
    }
    return false;
  }
};

// React Strict Mode helpers
export const strictModeHelpers = {
  // Double-invocation safe effect
  createStrictModeEffect: (effectFn, deps) => {
    return React.useEffect(() => {
      let cleanup;
      let mounted = true;
      
      const runEffect = async () => {
        if (mounted) {
          cleanup = await effectFn();
        }
      };
      
      runEffect();
      
      return () => {
        mounted = false;
        if (typeof cleanup === 'function') {
          cleanup();
        }
      };
    }, deps);
  },
  
  // Ref that persists through strict mode double-mounting
  useStrictModeRef: (initialValue) => {
    const ref = React.useRef(initialValue);
    const isFirstRender = React.useRef(true);
    
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
    
    return ref;
  }
};

// Common warning fixes
export const warningFixes = {
  // Fix for "Function components cannot be given refs" warning
  forwardRefWrapper: (Component, displayName) => {
    const WrappedComponent = React.forwardRef((props, ref) => {
      return <Component {...props} forwardedRef={ref} />;
    });
    
    WrappedComponent.displayName = displayName || Component.displayName || Component.name;
    return WrappedComponent;
  },
  
  // Fix for missing displayName in HOCs
  setDisplayName: (Component, name) => {
    Component.displayName = name;
    return Component;
  },
  
  // Fix for missing key prop warning
  addKeyToChildren: (children, keyPrefix = 'child') => {
    return React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          key: child.key || `${keyPrefix}-${index}`
        });
      }
      return child;
    });
  }
};

// Development-only helpers
if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
  // Warn about common anti-patterns
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
  
  // Detect potential memory leaks
  const componentCounts = new Map();
  
  window.trackComponentMount = (componentName) => {
    const count = componentCounts.get(componentName) || 0;
    componentCounts.set(componentName, count + 1);
    
    if (count > 100) {
      console.warn(
        `Potential memory leak: ${componentName} has been mounted ${count} times`
      );
    }
  };
}

export default {
  generateSafeKey,
  propValidation,
  memoryLeakPrevention,
  createSafeEventHandler,
  createSafeStateUpdater,
  effectCleanup,
  safeDom,
  strictModeHelpers,
  warningFixes
};