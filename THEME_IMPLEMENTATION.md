# Abron Restaurant Theme System Implementation

## Overview
This document details the comprehensive theme system implementation for the Abron restaurant application, based on the Profile.jsx color scheme. The theme provides consistent light and dark modes across the entire application.

## Color Palette
The theme is based on the warm, Ethiopian-inspired colors Green and brown from the logo

### Primary Colors
- **Brand Gradient**: `linear-gradient(135deg, #f3b63b 0%, #d56a2b 52%, #2f5d4a 100%)`
- **Deep Green**: `#2f5d4a` - Primary brand color
- **Golden Yellow**: `#f3b63b` - Accent highlights
- **Warm Orange**: `#d56a2b` - Secondary accent

### Light Theme
- **Background Primary**: `#f6efe7` - Main page background
- **Background Secondary**: `#fffaf4` - Card backgrounds
- **Text Primary**: `#1f2e28` - Main text
- **Text Accent**: `#2f5d4a` - Links and highlights
- **Border Primary**: `#eadfc8` - Main borders

### Dark Theme
- **Background Primary**: `#111b18` - Main page background
- **Background Secondary**: `#182b25` - Card backgrounds
- **Text Primary**: `#edf5ee` - Main text
- **Text Accent**: `#f4c867` - Links and highlights (golden)
- **Border Primary**: `#2b3f37` - Main borders

## File Structure

```
src/
├── theme/
│   ├── ThemeContext.jsx       # Theme provider and context
│   ├── colors.js              # Color definitions and utilities
│   ├── components.js          # Theme-aware component classes
│   ├── global.css             # Global theme CSS variables
│   └── ThemeToggle.jsx        # Theme toggle component
├── components/ui/
│   ├── ThemedButton.jsx       # Theme-aware button component
│   ├── ThemedCard.jsx         # Theme-aware card component
│   ├── ThemedInput.jsx        # Theme-aware input component
│   └── ThemedModal.jsx        # Theme-aware modal component
└── auth/
    └── ThemedLoginSignupModal.jsx # Theme-aware login modal
```

## Implementation Details

### 1. Theme Context (`src/theme/ThemeContext.jsx`)
- Manages global theme state (light/dark mode)
- Provides theme switching functionality
- Persists theme preference in localStorage
- Applies theme classes to document root

### 2. Color System (`src/theme/colors.js`)
- Centralized color definitions
- CSS custom property generation
- Theme-aware utility functions
- Consistent naming convention

### 3. Component Classes (`src/theme/components.js`)
- Pre-defined component styling classes
- Theme-aware variants (light/dark)
- Consistent component patterns
- Utility functions for theme application

### 4. Global Styles (`src/theme/global.css`)
- CSS custom properties for all theme colors
- Base component styles
- Utility classes
- Smooth transitions for theme switching

### 5. Themed Components (`src/components/ui/`)
- Reusable UI components with built-in theme support
- Consistent API across all components
- Automatic theme switching
- Accessibility considerations

## Usage Examples

### Basic Theme Usage
```jsx
import { useTheme } from '../theme/ThemeContext';
import { getThemeClass } from '../theme/components';

function MyComponent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const cardClasses = getThemeClass('card', 'base', isDarkMode);
  
  return (
    <div className={cardClasses}>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}
```

### Using Themed Components
```jsx
import ThemedButton from '../components/ui/ThemedButton';
import ThemedCard from '../components/ui/ThemedCard';

function MyPage() {
  return (
    <ThemedCard>
      <h1>Welcome</h1>
      <ThemedButton variant="primary" size="lg">
        Get Started
      </ThemedButton>
    </ThemedCard>
  );
}
```

### CSS Custom Properties
```css
.my-component {
  background: var(--abron-bg-secondary);
  color: var(--abron-text-primary);
  border: 1px solid var(--abron-border-secondary);
}
```

## Theme Application

### Updated Components
1. **App.jsx** - Wrapped with ThemeProvider
2. **NavBar.jsx** - Theme toggle and themed styling
3. **MobileAppShell.jsx** - Consistent theme across navigation
4. **HomePage.jsx** - Theme-aware page layout
5. **Hero.jsx** - Theme-aware typography and inputs
6. **Profile.jsx** - Original theme source (unchanged)
7. **LoginSignupModal.jsx** - Now uses ThemedLoginSignupModal

### CSS Updates
- **index.css** - Imports theme styles and variables
- **customer.css** - Enhanced with dark mode support
- All components use CSS custom properties where possible

## Features

### Automatic Theme Detection
- Respects user's system preference
- Remembers user's manual selection
- Smooth transitions between themes

### Accessibility
- High contrast ratios in both themes
- Consistent focus states
- Screen reader friendly

### Performance
- CSS custom properties for efficient updates
- Minimal re-renders on theme changes
- Optimized transition animations

### Consistency
- Unified color palette across all components
- Consistent spacing and typography
- Standardized component variants

## Dark Mode Support

### Text Contrast
- Light theme: Dark text on light backgrounds
- Dark theme: Light text on dark backgrounds
- Accent colors adjusted for optimal readability

### Visual Hierarchy
- Maintained across both themes
- Consistent emphasis patterns
- Clear information architecture

### Interactive Elements
- Hover states work in both themes
- Focus indicators remain visible
- Active states provide clear feedback

## Integration Points

### Existing Components
All existing components can be gradually migrated to use the theme system:

1. Replace hardcoded colors with theme variables
2. Use themed component classes
3. Add theme context where needed

### New Development
All new components should:

1. Use the themed UI components when possible
2. Follow the established color patterns
3. Support both light and dark modes
4. Use CSS custom properties for colors

## Maintenance

### Adding New Colors
1. Add color definitions to `colors.js`
2. Update CSS custom properties in `global.css`
3. Add component classes to `components.js` if needed
4. Test in both light and dark modes

### Component Updates
1. Ensure new components use theme context
2. Test theme switching functionality
3. Verify accessibility compliance
4. Update documentation as needed

## Browser Support
- Modern browsers supporting CSS custom properties
- Graceful degradation for older browsers
- Automatic fallbacks included

This theme system provides a robust foundation for maintaining consistent visual design across the entire Abron application while supporting both light and dark modes based on the beautiful Profile.jsx color scheme.