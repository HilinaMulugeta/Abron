import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  GiChiliPepper, 
  GiHotMeal, 
  GiPizzaSlice, 
  GiHamburger, 
  GiCoffeeCup 
} from "react-icons/gi";
import { 
  FiHeart, 
  FiPlus, 
  FiCheck, 
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiX
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

// Import our new API hooks and components
import { useMenu, useMenuCategories } from "../hooks/useMenu";
import { useCart, useFavorites } from "../hooks/useLocalStorage";
import { MenuGridSkeleton, SearchResultsSkeleton } from "../ui/SkeletonLoader";
import ErrorBoundary from "../components/ErrorBoundary";
import UnavailabilityOverlay from "./UnavailabilityOverlay";
import DishDetailModal from "./DishDetailModal";
import { announceToScreenReader } from "../utils/accessibility";

function EnhancedProductList() {
  // Local state
  const [activeCategory, setActiveCategory] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlySpicy, setOnlySpicy] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [page, setPage] = useState(1);
  
  // API hooks
  const { 
    data: products, 
    loading: productsLoading, 
    error: productsError,
    pagination,
    refetch 
  } = useMenu({
    category: activeCategory,
    availableOnly: onlyAvailable,
    search: searchQuery,
    page,
    limit: 12,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  
  const { 
    categories, 
    loading: categoriesLoading 
  } = useMenuCategories();
  
  // Cart and favorites hooks
  const {
    cartItems,
    addToCart,
    getCartItem,
    isInCart
  } = useCart();
  
  const {
    favorites,
    toggleFavorite,
    isFavorite
  } = useFavorites();
  
  // Category configuration with icons
  const categoryConfig = {
    all: { label: "All", icon: null },
    favorites: { label: "Favorites", icon: FaHeart, count: favorites?.length || 0 },
    main: { label: "Ethiopian", icon: GiHotMeal },
    pizza: { label: "Pizza", icon: GiPizzaSlice },
    burgers: { label: "Burgers", icon: GiHamburger },
    drinks: { label: "Drinks", icon: GiCoffeeCup },
    breakfast: { label: "Breakfast", icon: GiCoffeeCup },
    side: { label: "Sides", icon: null }
  };
  
  // Dynamic category pills based on API data
  const categoryPills = useMemo(() => {
    const staticCategories = [
      categoryConfig.all,
      categoryConfig.favorites
    ];
    
    const dynamicCategories = categories.map(category => ({
      label: category.charAt(0).toUpperCase() + category.slice(1),
      icon: categoryConfig[category.toLowerCase()]?.icon || GiHotMeal,
      value: category.toLowerCase()
    }));
    
    return [...staticCategories, ...dynamicCategories];
  }, [categories, favorites.length]);
  
  // Filter products for favorites when needed
  const filteredProducts = useMemo(() => {
    let filtered = products || [];
    
    // Apply favorites filter
    if (activeCategory === "favorites") {
      filtered = filtered.filter(dish => isFavorite(dish.id));
    }
    
    // Apply spicy filter
    if (onlySpicy) {
      filtered = filtered.filter(dish => dish.spicy);
    }
    
    return filtered;
  }, [products, activeCategory, onlySpicy, isFavorite]);
  
  // Get cart amount for a dish
  const getItemCartAmount = useCallback((id) => {
    const cartItem = getCartItem(id);
    return cartItem ? cartItem.quantity : 0;
  }, [getCartItem]);
  
  // Check if dish is available
  const isDishAvailable = useCallback((dish) => {
    return dish.availableToday !== false;
  }, []);
  
  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPage(1); // Reset to first page
    announceToScreenReader(`Switched to ${category} category`);
  };
  
  // Handle filter toggles
  const toggleAvailableFilter = () => {
    setOnlyAvailable(!onlyAvailable);
    setPage(1);
    announceToScreenReader(`${!onlyAvailable ? 'Showing only available' : 'Showing all'} items`);
  };
  
  const toggleSpicyFilter = () => {
    setOnlySpicy(!onlySpicy);
    setPage(1);
    announceToScreenReader(`${!onlySpicy ? 'Showing only spicy' : 'Showing all'} items`);
  };
  
  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setPage(1);
    
    if (query) {
      announceToScreenReader(`Searching for ${query}`);
    }
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setPage(1);
    announceToScreenReader('Search cleared');
  };
  
  // Handle add to cart
  const handleAddToCart = useCallback((dish, e) => {
    e?.stopPropagation();
    
    if (!isDishAvailable(dish)) {
      return;
    }
    
    addToCart(dish, 1);
    announceToScreenReader(`Added ${dish.name} to cart`);
  }, [addToCart, isDishAvailable]);
  
  // Handle favorite toggle
  const handleFavoriteToggle = useCallback((dishId, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const wasFavorite = isFavorite(dishId);
    toggleFavorite(filteredProducts.find(p => p.id === dishId));
    
    announceToScreenReader(
      wasFavorite ? 'Removed from favorites' : 'Added to favorites'
    );
  }, [toggleFavorite, isFavorite, filteredProducts]);
  
  // Handle load more
  const handleLoadMore = () => {
    if (pagination?.hasNextPage) {
      setPage(prev => prev + 1);
      announceToScreenReader('Loading more items');
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    refetch();
    announceToScreenReader('Refreshing menu items');
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setActiveCategory("all");
    setOnlyAvailable(false);
    setOnlySpicy(false);
    setSearchQuery("");
    setPage(1);
    announceToScreenReader('All filters cleared');
  };
  
  // Error state
  if (productsError) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 mt-4">
        <p className="text-red-500 font-medium text-sm mb-4">
          Failed to load menu items: {productsError}
        </p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-red-50 text-red-700 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors"
        >
          <FiRefreshCw className="inline-block mr-2" />
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <div 
        id="menu-section" 
        className="customer-menu-container w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 mt-6"
        role="region"
        aria-label="Menu items"
      >
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left text-gray-500 hover:border-gray-300 transition-colors"
              aria-expanded={showSearch}
              aria-label="Toggle search"
            >
              <FiSearch className="text-lg" />
              <span className="flex-1">
                {searchQuery || "Search dishes..."}
              </span>
            </button>
            
            {showSearch && (
              <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search for dishes..."
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    autoFocus
                    aria-label="Search dishes"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Category Pills Bar */}
        {categoriesLoading ? (
          <div className="flex gap-2 mb-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-6">
            {categoryPills.map((category) => {
              const isActive = activeCategory === (category.value || category.label.toLowerCase());
              const Icon = category.icon;
              
              return (
                <button
                  key={category.value || category.label}
                  onClick={() => handleCategoryChange(category.value || category.label.toLowerCase())}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-green-600 text-white shadow-sm shadow-green-600/30 scale-102"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                  aria-pressed={isActive}
                >
                  {Icon && (
                    <Icon 
                      className={
                        isActive 
                          ? "text-white" 
                          : category.label === "Favorites" 
                            ? "text-red-500" 
                            : "text-green-600"
                      } 
                    />
                  )}
                  <span>{category.label}</span>
                  {typeof category.count === "number" && (
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-white text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {category.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
        
        {/* Section Heading & Quick Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              {searchQuery ? `Search Results for "${searchQuery}"` : 
               activeCategory === 'favorites' ? 'Your Favorite Dishes' :
               activeCategory === 'all' ? 'Popular Dishes' : 
               `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Dishes`}
            </h2>
            <p className="text-xs text-gray-500">
              {productsLoading ? (
                "Loading dishes..."
              ) : (
                `${filteredProducts.length} ${filteredProducts.length === 1 ? "dish" : "dishes"} available for instant delivery`
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAvailableFilter}
              className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                onlyAvailable
                  ? "bg-green-600 text-white border-green-600 font-bold"
                  : "bg-white text-gray-600 border-gray-200 font-medium"
              }`}
              aria-pressed={onlyAvailable}
              aria-label={`${onlyAvailable ? 'Show all items' : 'Show only available items'}`}
            >
              <FiFilter className="text-xs" /> 
              Available Today
            </button>
            
            <button
              onClick={toggleSpicyFilter}
              className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                onlySpicy
                  ? "bg-red-500 text-white border-red-500 font-bold"
                  : "bg-white text-gray-600 border-gray-200 font-medium"
              }`}
              aria-pressed={onlySpicy}
              aria-label={`${onlySpicy ? 'Show all spice levels' : 'Show only spicy items'}`}
            >
              <GiChiliPepper className="text-sm" /> 
              Spicy
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={productsLoading}
              className="text-xs px-3 py-1.5 rounded-xl border bg-white text-gray-600 border-gray-200 font-medium hover:bg-gray-50 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
              aria-label="Refresh menu"
            >
              <FiRefreshCw className={`text-xs ${productsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
        
        {/* Loading State */}
        {productsLoading && page === 1 ? (
          <MenuGridSkeleton count={12} />
        ) : (
          <>
            {/* Product Grid */}
            <div 
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
              role="grid"
              aria-label="Dishes grid"
            >
              {filteredProducts.map((product) => {
                const { id, image, name, price, description, spicy } = product;
                const isAvailable = isDishAvailable(product);
                const fav = isFavorite(id);
                const cartAmount = getItemCartAmount(id);
                
                return (
                  <div
                    key={id}
                    onClick={() => setSelectedDish(product)}
                    className={`bg-white border border-gray-100 rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer hover:border-green-200 ${
                      !isAvailable ? "opacity-75" : ""
                    }`}
                    role="gridcell"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedDish(product);
                      }
                    }}
                    aria-label={`${name}, ${price} ETB${!isAvailable ? ', unavailable' : ''}`}
                  >
                    {/* Top part: Image and badging */}
                    <div>
                      <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-4/3 mb-2.5">
                        {/* Favorite Heart Button */}
                        <button
                          onClick={(e) => handleFavoriteToggle(id, e)}
                          className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/90 backdrop-blur-xs shadow-xs text-gray-500 hover:text-red-500 transition cursor-pointer"
                          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                          aria-pressed={fav}
                        >
                          {fav ? (
                            <FaHeart className="text-red-500 text-xs" />
                          ) : (
                            <FiHeart className="text-xs" />
                          )}
                        </button>
                        
                        {/* Spicy Badge */}
                        {spicy && (
                          <div className="absolute top-2 left-2 z-20 flex items-center gap-0.5 bg-red-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                            <GiChiliPepper className="text-xs" />
                            <span className="hidden sm:inline">Spicy</span>
                          </div>
                        )}
                        
                        {/* Food Image */}
                        <img
                          src={image}
                          alt={name}
                          className={`w-full h-full object-cover transition-transform duration-300 ${
                            isAvailable ? "hover:scale-105" : "blur-[1.5px] grayscale-[25%]"
                          }`}
                          loading="lazy"
                        />
                        
                        {/* Unavailability Overlay */}
                        {!isAvailable && (
                          <UnavailabilityOverlay
                            text="Unavailable Today"
                            size="small"
                          />
                        )}
                      </div>
                      
                      {/* Content info */}
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 line-clamp-1 leading-snug hover:text-green-700 transition">
                          {name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1 sm:line-clamp-2 mt-0.5 leading-tight">
                          {description || "Authentic freshly prepared traditional dish."}
                        </p>
                      </div>
                    </div>
                    
                    {/* Bottom Row: Price and Add Button */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-50">
                      <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                        ETB {price?.toLocaleString()}
                      </span>
                      
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={!isAvailable}
                        className={`flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isAvailable
                            ? cartAmount > 0
                              ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
                              : "bg-green-600 hover:bg-green-700 text-white shadow-xs active:scale-95 shadow-green-600/20"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed text-[10px]"
                        }`}
                        aria-label={
                          !isAvailable 
                            ? "Out of stock" 
                            : cartAmount > 0 
                              ? `Add another ${name} to cart. Currently ${cartAmount} in cart.`
                              : `Add ${name} to cart`
                        }
                      >
                        {isAvailable ? (
                          cartAmount > 0 ? (
                            <>
                              <FiCheck className="text-xs" />
                              <span>Add + ({cartAmount})</span>
                            </>
                          ) : (
                            <>
                              <span>Add +</span>
                            </>
                          )
                        ) : (
                          <span>Out of Stock</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Load More Button */}
            {pagination?.hasNextPage && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={productsLoading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label={`Load more dishes. Currently showing ${filteredProducts.length} of ${pagination.totalItems} items.`}
                >
                  {productsLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    `Load More (${pagination.totalItems - filteredProducts.length} remaining)`
                  )}
                </button>
              </div>
            )}
            
            {/* Empty State */}
            {filteredProducts.length === 0 && !productsLoading && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 mt-4">
                <p className="text-gray-400 font-medium text-sm mb-4">
                  {searchQuery ? `No dishes found for "${searchQuery}"` : "No dishes found for this filter."}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-xl hover:bg-green-100 transition-colors"
                >
                  Show All Dishes
                </button>
              </div>
            )}
          </>
        )}
        
        {/* Interactive Dish Detail Popup Modal */}
        {selectedDish && (
          <DishDetailModal
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default EnhancedProductList;