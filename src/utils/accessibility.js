// Accessibility utilities and helpers

// Screen reader announcements
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove the announcement after a short delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management
export const focusElement = (element, preventScroll = false) => {
  if (element && typeof element.focus === 'function') {
    element.focus({ preventScroll });
  }
};

export const focusFirstFocusableElement = (container) => {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusElement(focusableElements[0]);
  }
};

export const focusLastFocusableElement = (container) => {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusElement(focusableElements[focusableElements.length - 1]);
  }
};

// Get all focusable elements within a container
export const getFocusableElements = (container = document) => {
  const focusableSelectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');
  
  return Array.from(container.querySelectorAll(focusableSelectors))
    .filter(element => {
      return element.offsetWidth > 0 && 
             element.offsetHeight > 0 && 
             getComputedStyle(element).visibility !== 'hidden';
    });
};

// Keyboard navigation helpers
export const handleKeyboardNavigation = (event, options = {}) => {
  const {
    onEnter,
    onSpace,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEscape,
    onTab,
    preventDefault = true
  } = options;
  
  const keyHandlers = {
    'Enter': onEnter,
    ' ': onSpace, // Space key
    'ArrowUp': onArrowUp,
    'ArrowDown': onArrowDown,
    'ArrowLeft': onArrowLeft,
    'ArrowRight': onArrowRight,
    'Escape': onEscape,
    'Tab': onTab
  };
  
  const handler = keyHandlers[event.key];
  if (handler) {
    if (preventDefault) {
      event.preventDefault();
    }
    handler(event);
  }
};

// ARIA attributes helpers
export const getAriaAttributes = (options = {}) => {
  const {
    label,
    labelledBy,
    describedBy,
    expanded,
    selected,
    checked,
    disabled,
    required,
    invalid,
    live,
    atomic,
    relevant,
    busy,
    hidden,
    pressed,
    current,
    level,
    setSize,
    posInSet
  } = options;
  
  const attributes = {};
  
  if (label) attributes['aria-label'] = label;
  if (labelledBy) attributes['aria-labelledby'] = labelledBy;
  if (describedBy) attributes['aria-describedby'] = describedBy;
  if (typeof expanded === 'boolean') attributes['aria-expanded'] = expanded;
  if (typeof selected === 'boolean') attributes['aria-selected'] = selected;
  if (typeof checked === 'boolean') attributes['aria-checked'] = checked;
  if (typeof disabled === 'boolean') attributes['aria-disabled'] = disabled;
  if (typeof required === 'boolean') attributes['aria-required'] = required;
  if (typeof invalid === 'boolean') attributes['aria-invalid'] = invalid;
  if (live) attributes['aria-live'] = live;
  if (typeof atomic === 'boolean') attributes['aria-atomic'] = atomic;
  if (relevant) attributes['aria-relevant'] = relevant;
  if (typeof busy === 'boolean') attributes['aria-busy'] = busy;
  if (typeof hidden === 'boolean') attributes['aria-hidden'] = hidden;
  if (typeof pressed === 'boolean') attributes['aria-pressed'] = pressed;
  if (current) attributes['aria-current'] = current;
  if (typeof level === 'number') attributes['aria-level'] = level;
  if (typeof setSize === 'number') attributes['aria-setsize'] = setSize;
  if (typeof posInSet === 'number') attributes['aria-posinset'] = posInSet;
  
  return attributes;
};

// Generate unique IDs for accessibility
let idCounter = 0;
export const generateId = (prefix = 'element') => {
  return `${prefix}-${++idCounter}-${Date.now()}`;
};

// Skip link functionality
export const createSkipLink = (targetId, text = 'Skip to main content') => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:border focus:border-gray-300';
  
  return skipLink;
};

// High contrast mode detection
export const detectHighContrastMode = () => {
  // Check if Windows High Contrast mode is enabled
  if (window.matchMedia) {
    return window.matchMedia('(prefers-contrast: high)').matches ||
           window.matchMedia('(-ms-high-contrast: active)').matches;
  }
  return false;
};

// Reduced motion detection
export const prefersReducedMotion = () => {
  if (window.matchMedia) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

// Color contrast utilities
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (color) => {
    const rgb = color.match(/\d+/g);
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

export const meetsWCAGContrast = (color1, color2, level = 'AA', size = 'normal') => {
  const ratio = getContrastRatio(color1, color2);
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  } else {
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
  }
};

// Form accessibility helpers
export const createFormErrorMessage = (fieldId, message) => {
  const errorId = `${fieldId}-error`;
  
  return {
    id: errorId,
    message,
    'aria-live': 'polite',
    'aria-atomic': true,
    role: 'alert'
  };
};

export const getFormFieldAttributes = (fieldId, options = {}) => {
  const { required, invalid, errorId, describedBy } = options;
  
  const attributes = {
    id: fieldId,
    'aria-required': required || false,
    'aria-invalid': invalid || false
  };
  
  if (errorId && invalid) {
    attributes['aria-describedby'] = errorId;
  } else if (describedBy) {
    attributes['aria-describedby'] = describedBy;
  }
  
  return attributes;
};

// Live region for dynamic content updates
export class LiveRegion {
  constructor(options = {}) {
    const { 
      politeness = 'polite', 
      atomic = true, 
      relevant = 'additions text',
      label 
    } = options;
    
    this.element = document.createElement('div');
    this.element.setAttribute('aria-live', politeness);
    this.element.setAttribute('aria-atomic', atomic);
    this.element.setAttribute('aria-relevant', relevant);
    this.element.setAttribute('class', 'sr-only');
    
    if (label) {
      this.element.setAttribute('aria-label', label);
    }
    
    document.body.appendChild(this.element);
  }
  
  announce(message) {
    this.element.textContent = message;
  }
  
  clear() {
    this.element.textContent = '';
  }
  
  destroy() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// Trap focus within a container (for modals, dropdowns)
export class FocusTrap {
  constructor(container) {
    this.container = container;
    this.previousFocus = document.activeElement;
    this.focusableElements = [];
    this.firstFocusable = null;
    this.lastFocusable = null;
    
    this.updateFocusableElements();
    this.bindEvents();
  }
  
  updateFocusableElements() {
    this.focusableElements = getFocusableElements(this.container);
    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
  }
  
  bindEvents() {
    this.container.addEventListener('keydown', this.handleKeyDown);
  }
  
  handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      if (this.focusableElements.length === 0) {
        event.preventDefault();
        return;
      }
      
      if (event.shiftKey) {
        if (document.activeElement === this.firstFocusable) {
          event.preventDefault();
          focusElement(this.lastFocusable);
        }
      } else {
        if (document.activeElement === this.lastFocusable) {
          event.preventDefault();
          focusElement(this.firstFocusable);
        }
      }
    } else if (event.key === 'Escape') {
      this.release();
    }
  };
  
  activate() {
    if (this.firstFocusable) {
      focusElement(this.firstFocusable);
    }
  }
  
  release() {
    this.container.removeEventListener('keydown', this.handleKeyDown);
    
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      focusElement(this.previousFocus);
    }
  }
}