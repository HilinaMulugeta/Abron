// Abron Theme Colors - Based on Profile.jsx
export const abronTheme = {
  // Primary Brand Colors
  primary: {
    50: '#f6efe7',   // Light cream background
    100: '#fffaf4',  // Card backgrounds
    200: '#f4efe9',  // Hover states
    300: '#edf5ee',  // Subtle accents
    400: '#f0b84d',  // Hover borders
    500: '#f3b63b',  // Primary gold
    600: '#e0a632',  // Darker gold
    700: '#d56a2b',  // Orange accent
    800: '#b78329',  // Dark gold
    900: '#2f5d4a'   // Deep green
  },

  // Text Colors
  text: {
    light: {
      primary: '#1f2e28',     // Main text
      secondary: '#24382f',   // Headings
      tertiary: '#5d6f67',    // Secondary text
      muted: '#728077',       // Subtle text
      accent: '#2f5d4a'       // Accent text
    },
    dark: {
      primary: '#edf5ee',     // Main text
      secondary: '#f5f0e8',   // Headings
      tertiary: '#dfe9df',    // Secondary text
      muted: '#dce8e0',       // Subtle text
      accent: '#f4c867'       // Accent text (gold)
    }
  },

  // Background Colors
  background: {
    light: {
      primary: '#f6efe7',     // Main page background
      secondary: '#fffaf4',   // Card backgrounds
      tertiary: '#f4efe9',    // Hover states
      accent: '#edf5ee'       // Button backgrounds
    },
    dark: {
      primary: '#111b18',     // Main page background
      secondary: '#182b25',   // Card backgrounds
      tertiary: '#1e332e',    // Hover states
      accent: '#20352e'       // Button backgrounds
    }
  },

  // Border Colors
  border: {
    light: {
      primary: '#eadfc8',     // Main borders
      secondary: '#e8dcc5',   // Card borders
      tertiary: '#f0e6d8'     // Dividers
    },
    dark: {
      primary: '#2b3f37',     // Main borders
      secondary: '#2d413b',   // Card borders
      tertiary: '#2d413b'     // Dividers
    }
  },

  // Semantic Colors
  semantic: {
    success: '#16a34a',
    successLight: '#dcf5e4',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#dc2626',
    errorLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe'
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #f3b63b 0%, #d56a2b 52%, #2f5d4a 100%)',
    background: {
      light: 'linear-gradient(180deg, #f9f2e8 0%, #f4efe8 100%)',
      dark: 'linear-gradient(180deg, #0d1713 0%, #111d1a 100%)'
    }
  },

  // Shadows
  shadows: {
    sm: '0 10px 18px rgba(212,137,44,0.25)',
    md: '0 12px 28px rgba(54,38,17,0.08)',
    lg: '0 10px 20px rgba(24,35,30,0.05)',
    xl: '0 20px 50px rgba(23,51,33,0.19)'
  }
};

// CSS Custom Properties Generator
export const generateCSSVariables = (isDark = false) => {
  const theme = isDark ? 'dark' : 'light';
  
  return {
    // Primary Colors
    '--abron-primary-50': abronTheme.primary[50],
    '--abron-primary-100': abronTheme.primary[100],
    '--abron-primary-500': abronTheme.primary[500],
    '--abron-primary-900': abronTheme.primary[900],
    
    // Text Colors
    '--abron-text-primary': abronTheme.text[theme].primary,
    '--abron-text-secondary': abronTheme.text[theme].secondary,
    '--abron-text-tertiary': abronTheme.text[theme].tertiary,
    '--abron-text-muted': abronTheme.text[theme].muted,
    '--abron-text-accent': abronTheme.text[theme].accent,
    
    // Background Colors
    '--abron-bg-primary': abronTheme.background[theme].primary,
    '--abron-bg-secondary': abronTheme.background[theme].secondary,
    '--abron-bg-tertiary': abronTheme.background[theme].tertiary,
    '--abron-bg-accent': abronTheme.background[theme].accent,
    
    // Border Colors
    '--abron-border-primary': abronTheme.border[theme].primary,
    '--abron-border-secondary': abronTheme.border[theme].secondary,
    '--abron-border-tertiary': abronTheme.border[theme].tertiary,
    
    // Gradients
    '--abron-gradient-primary': abronTheme.gradients.primary,
    '--abron-gradient-bg': abronTheme.gradients.background[theme]
  };
};

// Utility function to get theme-aware classes
export const getThemeClasses = (isDark = false) => ({
  // Page layouts
  page: `bg-[${abronTheme.background[isDark ? 'dark' : 'light'].primary}] text-[${abronTheme.text[isDark ? 'dark' : 'light'].primary}]`,
  
  // Cards
  card: `bg-[${abronTheme.background[isDark ? 'dark' : 'light'].secondary}] border border-[${abronTheme.border[isDark ? 'dark' : 'light'].secondary}] shadow-[${abronTheme.shadows.lg}]`,
  
  // Buttons
  primaryButton: `bg-[${abronTheme.primary[900]}] hover:bg-[${abronTheme.primary[800]}] text-white`,
  secondaryButton: `bg-[${abronTheme.background[isDark ? 'dark' : 'light'].accent}] hover:bg-[${abronTheme.background[isDark ? 'dark' : 'light'].tertiary}] text-[${abronTheme.text[isDark ? 'dark' : 'light'].accent}]`,
  
  // Text
  heading: `text-[${abronTheme.text[isDark ? 'dark' : 'light'].secondary}] font-black`,
  body: `text-[${abronTheme.text[isDark ? 'dark' : 'light'].primary}]`,
  muted: `text-[${abronTheme.text[isDark ? 'dark' : 'light'].muted}]`
});

export default abronTheme;