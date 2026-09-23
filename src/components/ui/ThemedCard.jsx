import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeClass } from '../../theme/components';

const ThemedCard = ({
  children,
  variant = 'card',
  className = '',
  padding = 'p-6',
  ...props
}) => {
  const { isDarkMode } = useTheme();
  
  const cardClasses = getThemeClass(variant, 'base', isDarkMode);
  
  return (
    <div
      className={`${cardClasses} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default ThemedCard;