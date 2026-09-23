import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { getThemeClass } from '../../theme/components';
import { FiX } from 'react-icons/fi';

const ThemedModal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  showCloseButton = true,
  ...props
}) => {
  const { isDarkMode } = useTheme();
  
  if (!isOpen) return null;
  
  const modalContentClasses = getThemeClass('modal', 'content', isDarkMode);
  const headingClasses = getThemeClass('heading', 'secondary', isDarkMode);
  const mutedClasses = getThemeClass('text', 'muted', isDarkMode);
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className={`${modalContentClasses} ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {showCloseButton && (
          <button
            className={`absolute top-3 right-3 p-1 rounded-lg ${mutedClasses} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
            onClick={onClose}
          >
            <FiX className="text-lg" />
          </button>
        )}
        
        {title && (
          <h2 className={`text-lg mb-4 ${headingClasses}`}>
            {title}
          </h2>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default ThemedModal;