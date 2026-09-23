import React, { createContext, useContext, useEffect, useState } from 'react';
import { abronTheme, generateCSSVariables } from './colors';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to light
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('abron_dark_mode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Add/remove dark class
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Set CSS custom properties
    const cssVars = generateCSSVariables(isDarkMode);
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Save to localStorage
    localStorage.setItem('abron_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const getThemeColors = () => ({
    primary: abronTheme.primary,
    text: abronTheme.text[isDarkMode ? 'dark' : 'light'],
    background: abronTheme.background[isDarkMode ? 'dark' : 'light'],
    border: abronTheme.border[isDarkMode ? 'dark' : 'light'],
    semantic: abronTheme.semantic,
    gradients: abronTheme.gradients,
    shadows: abronTheme.shadows
  });

  const value = {
    isDarkMode,
    toggleTheme,
    theme: getThemeColors(),
    abronTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;