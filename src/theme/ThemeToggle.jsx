import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from './ThemeContext';
import { getThemeClass } from './components';

const ThemeToggle = ({ size = 'md', className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  const mutedClasses = getThemeClass('text', 'muted', isDarkMode);
  
  const sizeClasses = {
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-base',
    lg: 'p-2.5 text-lg'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`${mutedClasses} hover:text-[#d77a2f] dark:hover:text-[#f4c867] transition-all duration-200 rounded-lg ${isDarkMode ? 'hover:bg-[#1b2d29]' : 'hover:bg-[#f7efe6]'} ${sizeClasses[size]} ${className}`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? <FiSun /> : <FiMoon />}
    </button>
  );
};

export default ThemeToggle;