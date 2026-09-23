import { GiChiliPepper } from "react-icons/gi";

/**
 * SpicyBadge Component
 *
 * A configurable badge component to indicate spicy dishes across the application.
 * Designed for consistency across ProductList, ProductDetails, and Search components.
 *
 * @param {Object} props - Component props
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} props.position - Position variant: 'top-right', 'inline' (default: 'top-right')
 * @param {string} props.className - Additional CSS classes for customization
 * @param {boolean} props.showText - Whether to show "Spicy" text alongside icon (default: false)
 */
function SpicyBadge({
  size = "md",
  position = "top-right",
  className = "",
  showText = true,
}) {
  // Size configurations
  const sizeClasses = {
    sm: {
      container: "p-1",
      icon: "w-2.5 h-2.5",
      text: "text-xs",
    },
    md: {
      container: "p-1.5",
      icon: "w-3 h-3",
      text: "text-sm",
    },
    lg: {
      container: "p-2",
      icon: "w-4 h-4",
      text: "text-base",
    },
  };

  // Position configurations
  const positionClasses = {
    "top-right": "absolute top-2 right-2 z-10",
    inline: "inline-flex items-center gap-1",
  };

  // Get classes for current size
  const currentSize = sizeClasses[size] || sizeClasses.md;

  // Build container classes
  const containerClasses = `
    ${positionClasses[position]}
    ${showText ? "flex items-center gap-1 px-2 py-1" : currentSize.container}
    bg-red-500 text-white rounded-full shadow-lg transition-all duration-200 
    hover:bg-red-600 hover:shadow-xl
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div className={containerClasses} title="This dish is spicy">
      <GiChiliPepper className={currentSize.icon} />
      {showText && (
        <span className={`font-medium ${currentSize.text}`}>Spicy</span>
      )}
    </div>
  );
}

export default SpicyBadge;
