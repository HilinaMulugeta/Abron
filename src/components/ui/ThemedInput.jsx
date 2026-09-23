import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeClass } from '../../theme/components';

const ThemedInput = ({
  label,
  error,
  className = '',
  size = 'md',
  ...props
}) => {
  const { isDarkMode } = useTheme();
  
  const inputClasses = getThemeClass('input', 'base', isDarkMode);
  const textClasses = getThemeClass('text', 'primary', isDarkMode);
  const mutedClasses = getThemeClass('text', 'muted', isDarkMode);
  
  const sizeClasses = {
    sm: 'text-xs py-1.5',
    md: 'text-sm py-2',
    lg: 'text-base py-3'
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className={`block text-xs font-bold ${textClasses}`}>
          {label}
        </label>
      )}
      <input
        className={`${inputClasses} ${sizeClasses[size]} ${className} ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default ThemedInput;