// Theme-aware component classes following Profile.jsx design
import { abronTheme } from './colors';

export const themeComponents = {
  // Page Layouts
  page: {
    base: 'min-h-screen transition-colors duration-200',
    light: 'bg-[#f6efe7] text-[#1f2e28]',
    dark: 'bg-[#111b18] text-[#edf5ee]'
  },

  container: {
    base: 'max-w-xl mx-auto px-4 py-6',
    light: '',
    dark: ''
  },

  // Cards & Surfaces
  card: {
    base: 'rounded-2xl border transition-all duration-200',
    light: 'bg-[#fffaf4] border-[#eadfc8] shadow-[0_12px_28px_rgba(54,38,17,0.08)]',
    dark: 'bg-[#182b25] border-[#2b3f37] shadow-[0_12px_28px_rgba(0,0,0,0.15)]'
  },

  surfaceCard: {
    base: 'rounded-2xl border transition-all duration-200',
    light: 'bg-[#fffaf4] border-[#e8dcc5] shadow-[0_10px_20px_rgba(24,35,30,0.05)]',
    dark: 'bg-[#182b25] border-[#2d413b] shadow-[0_10px_20px_rgba(0,0,0,0.1)]'
  },

  // Typography
  heading: {
    primary: {
      base: 'font-black leading-tight',
      light: 'text-[#1f2f27]',
      dark: 'text-[#f5f0e8]'
    },
    secondary: {
      base: 'font-bold',
      light: 'text-[#24382f]',
      dark: 'text-[#f5f0e8]'
    }
  },

  text: {
    primary: {
      base: '',
      light: 'text-[#1f2e28]',
      dark: 'text-[#edf5ee]'
    },
    secondary: {
      base: 'font-medium',
      light: 'text-[#5d6f67]',
      dark: 'text-[#dfe9df]'
    },
    muted: {
      base: 'font-medium',
      light: 'text-[#728077]',
      dark: 'text-[#dce8e0]'
    },
    accent: {
      base: 'font-semibold',
      light: 'text-[#2f5d4a]',
      dark: 'text-[#f4c867]'
    }
  },

  // Buttons
  button: {
    primary: {
      base: 'font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2',
      light: 'bg-[#2f5d4a] hover:bg-[#1e4033] text-white shadow-[0_10px_18px_rgba(47,93,74,0.25)]',
      dark: 'bg-[#2f5d4a] hover:bg-[#1e4033] text-white shadow-[0_10px_18px_rgba(47,93,74,0.35)]'
    },
    secondary: {
      base: 'font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2',
      light: 'bg-[#edf5ee] hover:bg-[#f4efe9] text-[#2f5d4a] border border-[#e8dcc5]',
      dark: 'bg-[#20352e] hover:bg-[#1e332e] text-[#f4c867] border border-[#2d413b]'
    },
    ghost: {
      base: 'font-bold rounded-xl transition-all duration-200',
      light: 'text-[#7d8a80] hover:text-[#2f5d4a] hover:bg-[#edf5ee]',
      dark: 'text-[#dbe7de] hover:text-[#f7cf6a] hover:bg-[#20352e]'
    }
  },

  // Form Elements
  input: {
    base: 'w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-[#2f5d4a] focus:outline-none transition-all duration-200',
    light: 'bg-white border-[#e8dcc5] text-[#1f2e28] focus:border-[#2f5d4a]',
    dark: 'bg-[#14261a] border-[#2d413b] text-[#edf5ee] focus:border-[#f4c867]'
  },

  select: {
    base: 'w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-[#2f5d4a] focus:outline-none transition-all duration-200',
    light: 'bg-white border-[#e8dcc5] text-[#1f2e28] focus:border-[#2f5d4a]',
    dark: 'bg-[#14261a] border-[#2d413b] text-[#edf5ee] focus:border-[#f4c867]'
  },

  // Interactive Elements
  toggle: {
    base: 'w-11 h-6 rounded-full transition-colors relative cursor-pointer',
    active: {
      light: 'bg-[#2f5d4a]',
      dark: 'bg-[#2f5d4a]'
    },
    inactive: {
      light: 'bg-[#dfe5df]',
      dark: 'bg-[#2c3b35]'
    },
    thumb: 'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform'
  },

  // Status & Feedback
  badge: {
    primary: {
      base: 'inline-flex items-center px-2 py-1 rounded-lg font-bold text-xs',
      light: 'bg-[#f6e7c2] text-[#b78329]',
      dark: 'bg-[#2b352d] text-[#f4c867]'
    },
    success: {
      base: 'inline-flex items-center px-2 py-1 rounded-lg font-bold text-xs',
      light: 'bg-[#dcf5e4] text-[#078f3b]',
      dark: 'bg-[#0f2d18] text-[#4ade80]'
    },
    error: {
      base: 'inline-flex items-center px-2 py-1 rounded-lg font-bold text-xs',
      light: 'bg-red-50 text-red-600',
      dark: 'bg-red-900/20 text-red-400'
    }
  },

  // Navigation
  navItem: {
    base: 'flex items-center gap-3 px-4 py-3.5 transition-all duration-200 cursor-pointer',
    light: 'hover:bg-[#f4efe9] text-[#24382f]',
    dark: 'hover:bg-[#1e332e] text-[#f5f0e8]'
  },

  // Avatar
  avatar: {
    base: 'rounded-full flex items-center justify-center font-black text-white shadow-[0_10px_18px_rgba(212,137,44,0.25)]',
    gradient: 'bg-[linear-gradient(135deg,#f3b63b_0%,#d56a2b_52%,#2f5d4a_100%)]'
  },

  // Dividers
  divider: {
    base: 'border-t',
    light: 'border-[#f0e6d8]',
    dark: 'border-[#2d413b]'
  },

  // Modal
  modal: {
    backdrop: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50',
    content: {
      base: 'relative w-full max-w-md rounded-2xl border p-6 shadow-xl',
      light: 'bg-white border-[#e8dcc5]',
      dark: 'bg-[#182b25] border-[#2d413b]'
    }
  }
};

// Utility function to get theme classes
export const getThemeClass = (component, variant = 'base', isDark = false) => {
  const comp = themeComponents[component];
  if (!comp) return '';
  
  const base = comp.base || '';
  const themeClass = isDark ? (comp.dark || '') : (comp.light || '');
  
  if (variant === 'base') {
    return `${base} ${themeClass}`.trim();
  }
  
  const variantComp = comp[variant];
  if (!variantComp) return base;
  
  const variantBase = variantComp.base || '';
  const variantTheme = isDark ? (variantComp.dark || '') : (variantComp.light || '');
  
  return `${variantBase} ${variantTheme}`.trim();
};

// Helper to combine multiple theme classes
export const combineThemeClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export default themeComponents;