import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeClass } from '../../theme/components';

const ThemedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  const { isDarkMode } = useTheme();
  
  const baseClasses = getThemeClass('button', variant, isDarkMode);
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default ThemedButton;