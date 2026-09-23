import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  FiSearch,
  FiHeart,
  FiFilter,
  FiCheck,
  FiChevronDown,
  FiShoppingBag,
  FiX,
  FiRefreshCw
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { GiChiliPepper } from "react-icons/gi";
import { useSearchParams } from "react-router-dom";

import MobileAppShell from "../components/MobileAppShell";
import { useMenuSearch, useMenuCategories } from "../hooks/useMenu";
import { useCart, useFavorites } from "../hooks/useLocalStorage";
import { SearchResultsSkeleton } from "../ui/SkeletonLoader";
import ErrorBoundary from "../components/ErrorBoundary";
import UnavailabilityOverlay from "../components/UnavailabilityOverlay";
import DishDetailModal from "../components/DishDetailModal";
import { announceToScreenReader, handleKeyboardNavigation } from "../utils/accessibility";

export default function EnhancedSearch() {
  // URL params
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const queryParam = searchParams.get("q") || "";
  
  // Local state
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlySpicy, setOnlySpicy] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [selectedDish, setSelectedDish] = useState(null);
  const [page, setPage] = useState(1);
  
  // API hooks
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    pagination,
    debouncedSearch
  } = useMenuSearch();
  
  const { 
    categories, 
    loading: categoriesLoading 
  } = useMenuCategories();
  
  // Cart and favorites
  const {
    addToCart,
    getCartItem,
    isInCart
  } = useCart();
  
  const {
    toggleFavorite,
    isFavorite
  } = useFavorites();
  
  // Sync with URL params
  useEffect(() => {
    if (queryParam && queryParam !== query) {
      setQuery(queryParam);
    }
  }, [queryParam, query, setQuery]);
  
  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam, selectedCategory]);
  
  // Update URL when search changes
  const updateSearchParams = useCallback((newQuery, newCategory) => {
    const params = new URLSearchParams(searchParams);
    
    if (newQuery) {
      params.set("q", newQuery);
    } else {
      params.delete("q");
    }
    
    if (newCategory && newCategory !== "all") {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }
    
    setSearchParams(params);
  }, [searchParams, setSearchParams]);
  
  // Enhanced category list
  const enhancedCategories = useMemo(() => {
    const baseCategories = [
      { value: "all", label: "All" },
      { value: "ethiopian", label: "Ethiopian" },
      { value: "pizza", label: "Pizza" },
      { value: "burgers", label: "Burgers" },
      { value: "drinks", label: "Drinks" }
    ];
    
    const dynamicCategories = categories
      .filter(cat => !baseCategories.some(base => 
        base.value === cat.toLowerCase() || 
        (base.value === "ethiopian" && cat.toLowerCase() === "main")
      ))
      .map(cat => ({
        value: cat.toLowerCase(),
        label: cat.charAt(0).toUpperCase() + cat.slice(1)
      }));
    
    return [...baseCategories, ...dynamicCategories];
  }, [categories]);
  
  // Filter and sort results
  const processedResults = useMemo(() => {
    let filtered = results || [];
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(product => {
        const category = product.category?.toLowerCase() || "";
        const name = product.name?.toLowerCase() || "";
        
        if (selectedCategory === "ethiopian") {
          return category === "main" || 
                 category.includes("stew") ||
                 category.includes("meat") ||
                 name.includes("doro") ||
                 name.includes("tibs") ||
                 name.includes("kitfo");
        }
        
        return category === selectedCategory;
      });
    }
    
    // Apply availability filter
    if (onlyAvailable) {
      filtered = filtered.filter(product => product.availableToday !== false);
    }
    
    // Apply spicy filter
    if (onlySpicy) {
      filtered = filtered.filter(product => product.spicy);
    }
    
    // Apply sorting
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    
    return filtered;
  }, [results, selectedCategory, onlyAvailable, onlySpicy, sortBy]);
  
  // Handle search
  const handleSearch = useCallback((searchValue) => {
    setQuery(searchValue);
    setPage(1);
    
    // Debounced search with filters
    debouncedSearch(searchValue, {
      category: selectedCategory === "all" ? undefined : selectedCategory,
      availableOnly: onlyAvailable,
      page: 1,
      limit: 20
    });
    
    updateSearchParams(searchValue, selectedCategory);
    
    if (searchValue) {
      announceToScreenReader(`Searching for ${searchValue}`);
    }
  }, [setQuery, debouncedSearch, selectedCategory, onlyAvailable, updateSearchParams]);
  
  // Handle category change
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setPage(1);
    
    // Re-search with new category
    if (query) {
      debouncedSearch(query, {
        category: category === "all" ? undefined : category,
        availableOnly: onlyAvailable,
        page: 1,
        limit: 20
      });
    }
    
    updateSearchParams(query, category);
    announceToScreenReader(`Switched to ${category} category`);
  }, [query, debouncedSearch, onlyAvailable, updateSearchParams]);
  
  // Handle filter toggles
  const toggleAvailableFilter = useCallback(() => {
    const newValue = !onlyAvailable;
    setOnlyAvailable(newValue);
    setPage(1);
    
    if (query) {
      debouncedSearch(query, {
        category: selectedCategory === "all" ? undefined : selectedCategory,
        availableOnly: newValue,
        page: 1,
        limit: 20
      });
    }
    
    announceToScreenReader(`${newValue ? 'Showing only available' : 'Showing all'} items`);
  }, [onlyAvailable, query, debouncedSearch, selectedCategory]);
  
  const toggleSpicyFilter = useCallback(() => {
    setOnlySpicy(!onlySpicy);
    announceToScreenReader(`${!onlySpicy ? 'Showing only spicy' : 'Showing all spice levels'} items`);
  }, [onlySpicy]);
  
  // Handle add to cart
  const handleAddToCart = useCallback((product, e) => {
    e?.stopPropagation();
    
    if (product.availableToday === false) {
      return;
    }
    
    addToCart(product, 1);
    announceToScreenReader(`Added ${product.name} to cart`);
  }, [addToCart]);
  
  // Handle favorite toggle
  const handleFavoriteToggle = useCallback((product, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const wasFavorite = isFavorite(product.id);
    toggleFavorite(product);
    
    announceToScreenReader(
      wasFavorite ? 'Removed from favorites' : 'Added to favorites'
    );
  }, [toggleFavorite, isFavorite]);
  
  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setQuery("");
    setSelectedCategory("all");
    setOnlyAvailable(false);
    setOnlySpicy(false);
    setSortBy("default");
    setPage(1);
    setSearchParams({});
    announceToScreenReader('All filters cleared');
  }, [setQuery, setSearchParams]);
  
  // Check if dish is available
  const isDishAvailable = useCallback((dish) => {
    return dish.availableToday !== false;
  }, []);
  
  // Get cart amount for a dish
  const getCartAmount = useCallback((dishId) => {
    const cartItem = getCartItem(dishId);
    return cartItem ? cartItem.quantity : 0;
  }, [getCartItem]);
  
  return (
    <ErrorBoundary>
      <MobileAppShell>
        <div className="customer-page search-page max-w-[1240px] mx-auto px-4 sm:px-6 py-6">
          {/* Header and Quick Toggle Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-green-700 mb-1">
                Addis Ababa Food Catalog
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Search Dishes & Cuisine
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={toggleAvailableFilter}
                className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer font-bold ${
                  onlyAvailable
                    ? "bg-green-600 text-white border-green-600 shadow-xs"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
                aria-pressed={onlyAvailable}
                aria-label={`${onlyAvailable ? 'Show all items' : 'Show only available items'}`}
              >
                <FiFilter className="text-xs" /> Available Today
              </button>
              
              <button
                onClick={toggleSpicyFilter}
                className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer font-bold ${
                  onlySpicy
                    ? "bg-red-500 text-white border-red-500 shadow-xs"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
                aria-pressed={onlySpicy}
                aria-label={`${onlySpicy ? 'Show all spice levels' : 'Show only spicy items'}`}
              >
                <GiChiliPepper className="text-sm" /> Spicy
              </button>
              
              {/* Sort selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none pr-7"
                  aria-label="Sort results"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A–Z</option>
                </select>
                <FiChevronDown className="absolute right-2 top-2.5 text-xs text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          {/* Search Input Box */}
          <div className="relative mb-5">
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-xs focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100 transition">
              <FiSearch className="text-gray-400 text-lg shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search dishes (e.g. Doro, Tibs, Shiro, Kitfo, Burger, Pizza)..."
                aria-label="Search dishes"
                className="w-full text-sm text-gray-900 placeholder-gray-400 bg-transparent border-0 outline-none font-medium"
              />
              {query && (
                <button
                  onClick={() => handleSearch("")}
                  className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                  aria-label="Clear search"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>
          
          {/* Category Horizontal Filter Pills */}
          {categoriesLoading ? (
            <div className="flex gap-2 mb-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-8 w-20 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 no-scrollbar">
              {enhancedCategories.map((category) => {
                const isActive = selectedCategory === category.value;
                return (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
                    className={`text-xs px-4 py-2 rounded-xl whitespace-nowrap transition font-bold cursor-pointer shrink-0 ${
                      isActive
                        ? "bg-green-600 text-white shadow-xs"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
                    }`}
                    aria-pressed={isActive}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          )}
          
          {/* Results Counter */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs font-bold text-gray-500">
              {loading ? (
                "Searching..."
              ) : (
                <>
                  Showing <span className="text-gray-900 font-extrabold">{processedResults.length}</span>{" "}
                  {processedResults.length === 1 ? "dish" : "dishes"}
                </>
              )}
            </p>
            {query && (
              <span className="text-xs text-green-700 font-semibold bg-green-50 px-2.5 py-0.5 rounded-full">
                Matching "{query}"
              </span>
            )}
          </div>
          
          {/* Error State */}
          {error && (
            <div className="text-center py-8 bg-red-50 rounded-2xl border border-red-200 mb-4">
              <p className="text-red-600 font-medium text-sm mb-2">
                Search failed: {error}
              </p>
              <button
                onClick={() => handleSearch(query)}
                className="px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-xl hover:bg-red-200 transition-colors"
              >
                <FiRefreshCw className="inline-block mr-2" />
                Try Again
              </button>
            </div>
          )}
          
          {/* Loading State */}
          {loading && (
            <SearchResultsSkeleton count={8} />
          )}
          
          {/* Results Grid */}
          {!loading && !error && (
            <div 
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
              role="grid"
              aria-label="Search results"
            >
              {processedResults.map((product) => {
                const isAvailable = isDishAvailable(product);
                const fav = isFavorite(product.id);
                const cartAmount = getCartAmount(product.id);
                
                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedDish(product)}
                    className={`bg-white border border-gray-100 rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md hover:border-green-200 cursor-pointer ${
                      !isAvailable ? "opacity-80" : ""
                    }`}
                    role="gridcell"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      handleKeyboardNavigation(e, {
                        onEnter: () => setSelectedDish(product),
                        onSpace: () => setSelectedDish(product)
                      });
                    }}
                    aria-label={`${product.name}, ${product.price} ETB${!isAvailable ? ', unavailable' : ''}`}
                  >
                    {/* Image Container with Badges */}
                    <div>
                      <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-4/3 mb-2.5">
                        {/* Favorite Heart Button */}
                        <button
                          onClick={(e) => handleFavoriteToggle(product, e)}
                          className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs shadow-xs text-gray-500 hover:text-red-500 transition flex items-center justify-center cursor-pointer"
                          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                          aria-pressed={fav}
                        >
                          {fav ? (
                            <FaHeart className="text-red-500 text-xs" />
                          ) : (
                            <FiHeart className="text-xs" />
                          )}
                        </button>
                        
                        {/* Spicy Tag */}
                        {product.spicy && (
                          <div className="absolute top-2 left-2 z-20 flex items-center gap-0.5 bg-red-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs pointer-events-none">
                            <GiChiliPepper className="text-xs" />
                            <span className="hidden sm:inline">Spicy</span>
                          </div>
                        )}
                        
                        {/* Food Image */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`w-full h-full object-cover transition-transform duration-300 ${
                            isAvailable
                              ? "hover:scale-105"
                              : "blur-[1.5px] grayscale-[25%]"
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
                      
                      {/* Dish Info */}
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                            {product.category || "Main"}
                          </span>
                          {!isAvailable && (
                            <span className="text-[9px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded-sm">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        
                        <h3
                          className={`font-extrabold text-xs sm:text-sm truncate leading-snug mt-0.5 transition ${
                            isAvailable
                              ? "text-gray-900 hover:text-green-700"
                              : "text-gray-500"
                          }`}
                        >
                          {product.name}
                        </h3>
                        
                        <div className="flex items-baseline justify-between mt-1">
                          <span
                            className={`text-xs sm:text-sm font-black ${
                              isAvailable ? "text-green-700" : "text-gray-400 line-through"
                            }`}
                          >
                            ETB {product.price?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={!isAvailable}
                      className={`w-full mt-3 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        isAvailable
                          ? cartAmount > 0
                            ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
                            : "bg-green-600 hover:bg-green-700 text-white shadow-xs active:scale-95"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      aria-label={
                        !isAvailable 
                          ? "Unavailable today" 
                          : cartAmount > 0 
                            ? `Add another ${product.name} to cart. Currently ${cartAmount} in cart.`
                            : `Add ${product.name} to cart`
                      }
                    >
                      {isAvailable ? (
                        cartAmount > 0 ? (
                          <>
                            <FiCheck className="text-xs" /> In Cart ({cartAmount})
                          </>
                        ) : (
                          <>
                            <FiShoppingBag className="text-xs" /> Add to Cart
                          </>
                        )
                      ) : (
                        "Unavailable Today"
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Empty State */}
          {!loading && !error && processedResults.length === 0 && (
            <div className="search-empty text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 shadow-xs mt-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3 text-xl">
                <FiSearch />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                No dishes found
              </h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
                {query 
                  ? `We couldn't find any dishes matching "${query}". Try another search term or reset filters.`
                  : "No dishes match your current filters. Try adjusting your search criteria."
                }
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Reset All Filters
              </button>
            </div>
          )}
          
          {/* Load More Button */}
          {pagination?.hasNextPage && !loading && (
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  debouncedSearch(query, {
                    category: selectedCategory === "all" ? undefined : selectedCategory,
                    availableOnly: onlyAvailable,
                    page: nextPage,
                    limit: 20
                  });
                }}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label={`Load more results. Currently showing ${processedResults.length} of ${pagination.totalItems} items.`}
              >
                Load More ({pagination.totalItems - processedResults.length} remaining)
              </button>
            </div>
          )}
          
          {/* Interactive Dish Detail Modal */}
          {selectedDish && (
            <DishDetailModal
              dish={selectedDish}
              onClose={() => setSelectedDish(null)}
            />
          )}
        </div>
      </MobileAppShell>
    </ErrorBoundary>
  );
}