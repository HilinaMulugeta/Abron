import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { getThemeClass } from '../theme/components';

const ThemedLayout = ({ 
  children, 
  className = '', 
  variant = 'page',
  containerClass = '' 
}) => {
  const { isDarkMode } = useTheme();
  
  const pageClasses = getThemeClass('page', 'base', isDarkMode);
  const containerClasses = getThemeClass('container', 'base', isDarkMode);
  
  return (
    <div className={`${pageClasses} ${className}`}>
      <div className={`${containerClasses} ${containerClass}`}>
        {children}
      </div>
    </div>
  );
};

export default ThemedLayout;