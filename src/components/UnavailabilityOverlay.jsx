/**
 * UnavailabilityOverlay Component
 * 
 * A reusable overlay component that displays over dish images when they are unavailable.
 * Designed for consistency across ProductList, ProductDetails, and Search components.
 * Features:
 * - Semi-transparent black background with blur effect
 * - Configurable overlay text (defaults to "Unavailable Today")
 * - Absolute positioning to cover entire container
 * - Proper z-index layering (z-20 to appear above images but below other UI elements)
 * - Responsive text sizing for different screen sizes
 * 
 * @param {Object} props - Component props
 * @param {string} props.text - Custom overlay text (default: "Unavailable Today")
 * @param {string} props.className - Additional CSS classes for customization
 * @param {string} props.size - Size variant: 'small', 'default', 'large' (default: 'default')
 */
function UnavailabilityOverlay({ 
  text = "Unavailable Today", 
  className = "",
  size = "default" 
}) {
  // Size configurations for different contexts
  const sizeClasses = {
    small: {
      text: "text-xs",
      padding: "px-2 py-1"
    },
    default: {
      text: "text-sm", 
      padding: "px-3 py-1"
    },
    large: {
      text: "text-base",
      padding: "px-4 py-2"
    }
  };

  // Get classes for current size
  const currentSize = sizeClasses[size] || sizeClasses.default;
  
  // Build overlay classes
  const overlayClasses = `
    absolute inset-0 
    bg-black bg-opacity-30 
    flex items-center justify-center 
    z-20
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Build text span classes  
  const textClasses = `
    text-white font-semibold 
    bg-black bg-opacity-40 
    rounded-lg backdrop-blur-sm
    ${currentSize.text} ${currentSize.padding}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div 
      className={overlayClasses}
      role="img" 
      aria-label={`Dish overlay: ${text}`}
    >
      <span className={textClasses}>
        {text}
      </span>
    </div>
  );
}

export default UnavailabilityOverlay;