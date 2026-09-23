import { useContext, useState, useMemo } from "react";
import { ShopContext } from "./ShopContext";
import { Link } from "react-router-dom";
import { GiChiliPepper, GiHotMeal, GiPizzaSlice, GiHamburger, GiCoffeeCup } from "react-icons/gi";
import { FiHeart, FiPlus, FiCheck, FiFilter } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useTheme } from "../theme/ThemeContext";
import UnavailabilityOverlay from "./UnavailabilityOverlay";
import DishDetailModal from "./DishDetailModal";

function ProductList() {
  const { isDarkMode } = useTheme();
  const { products, addToCart, cart, isDishAvailable, toggleFavorite, isFavorite, favorites } =
    useContext(ShopContext);

  const [activeCategory, setActiveCategory] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlySpicy, setOnlySpicy] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  // Category items with icons
  const categoryPills = [
    { label: "All", icon: null },
    { label: "Favorites", icon: FaHeart, count: favorites?.length || 0 },
    { label: "Ethiopian", icon: GiHotMeal },
    { label: "Pizza", icon: GiPizzaSlice },
    { label: "Burgers", icon: GiHamburger },
    { label: "Drinks", icon: GiCoffeeCup },
    { label: "Breakfast", icon: GiCoffeeCup },
    { label: "Main", icon: GiHotMeal },
    { label: "Side", icon: null },
  ];

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return products.filter((dish) => {
      const catLower = (dish.category || "").toLowerCase();
      const nameLower = (dish.name || "").toLowerCase();

      const matchesCategory =
        activeCategory === "All" ||
        (activeCategory === "Favorites" && isFavorite(dish.id)) ||
        (activeCategory === "Pizza" && (catLower === "pizza" || nameLower.includes("pizza"))) ||
        (activeCategory === "Burgers" && (catLower === "burgers" || catLower === "burger" || nameLower.includes("burger"))) ||
        (activeCategory === "Drinks" && (catLower.includes("drink") || nameLower.includes("smoothy") || nameLower.includes("shake") || nameLower.includes("mojitto"))) ||
        catLower === activeCategory.toLowerCase() ||
        (activeCategory === "Ethiopian" &&
          (catLower.includes("stew") ||
            catLower.includes("meat") ||
            catLower === "main" ||
            nameLower.includes("doro") ||
            nameLower.includes("tibs") ||
            nameLower.includes("shiro") ||
            nameLower.includes("firfir") ||
            nameLower.includes("kitfo") ||
            nameLower.includes("shekla") ||
            nameLower.includes("rawmeat") ||
            nameLower.includes("tegabino")));

      const available = isDishAvailable(dish);
      const matchesAvailability = !onlyAvailable || available;
      const matchesSpicy = !onlySpicy || Boolean(dish.spicy);

      return matchesCategory && matchesAvailability && matchesSpicy;
    });
  }, [products, activeCategory, onlyAvailable, onlySpicy, isDishAvailable, favorites]);

  // Check if dish is in cart and return amount
  const getItemCartAmount = (id) => {
    const item = cart.find((i) => String(i.id) === String(id));
    return item ? item.amount : 0;
  };

  return (
    <div id="menu-section" className="customer-menu-container w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      {/* Profile.jsx style category pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-6">
        {categoryPills.map(({ label, icon: Icon, count }) => {
          const isActive = activeCategory === label;
          return (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? isDarkMode 
                    ? "bg-[#2f5d4a] text-white shadow-[0_10px_18px_rgba(47,93,74,0.25)]"
                    : "bg-[#2f5d4a] text-white shadow-[0_10px_18px_rgba(47,93,74,0.25)]"
                  : isDarkMode
                    ? "bg-[#182b25] border-[#2d413b] text-[#f5f0e8] hover:bg-[#1e332e] border"
                    : "bg-[#fffaf4] border-[#e8dcc5] text-[#1f2f27] hover:bg-[#f4efe9] border"
              }`}
            >
              {Icon && <Icon className={isActive ? "text-white" : label === "Favorites" ? "text-red-500" : isDarkMode ? "text-[#f4c867]" : "text-[#2f5d4a]"} />}
              <span>{label}</span>
              {typeof count === "number" && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-white text-[#2f5d4a]"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Section Heading & Quick Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-[#1f2f27] dark:text-[#f5f0e8] tracking-tight">
            Popular Dishes
          </h2>
          <p className="text-xs text-[#5d6f67] dark:text-[#c9d9d0]">
            {filteredDishes.length} {filteredDishes.length === 1 ? "dish" : "dishes"} available for instant delivery
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
              onlyAvailable
                ? "bg-[#2f5d4a] text-white border-[#2f5d4a] font-bold"
                : "bg-[#fffaf4] dark:bg-[#182b25] text-[#5d6f67] dark:text-[#c9d9d0] border-[#e8dcc5] dark:border-[#2d413b] font-medium"
            }`}
          >
            <FiFilter className="text-xs" /> Available Today
          </button>
          <button
            onClick={() => setOnlySpicy(!onlySpicy)}
            className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
              onlySpicy
                ? "bg-red-500 text-white border-red-500 font-bold"
                : "bg-[#fffaf4] dark:bg-[#182b25] text-[#5d6f67] dark:text-[#c9d9d0] border-[#e8dcc5] dark:border-[#2d413b] font-medium"
            }`}
          >
            <GiChiliPepper className="text-sm" /> Spicy
          </button>
        </div>
      </div>

      {/* Responsive Grid: 2 cols on mobile, 3 cols on tablet, 4 cols on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {filteredDishes.map((product) => {
          const { id, image, name, price, description, spicy } = product;
          const isAvailable = isDishAvailable(product);
          const fav = isFavorite(id);
          const cartAmount = getItemCartAmount(id);

          return (
            <div
              key={id}
              onClick={() => setSelectedDish(product)}
              className={`bg-[#fffaf4] dark:bg-[#182b25] border border-[#e8dcc5] dark:border-[#2d413b] rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer hover:border-[#f0b84d] ${
                !isAvailable ? "opacity-75" : ""
              }`}
            >
              {/* Top part: Image and badging */}
              <div>
                <div className="relative overflow-hidden rounded-xl bg-[#f6efe7] dark:bg-[#20352e] aspect-4/3 mb-2.5">
                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(id);
                    }}
                    className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-[#fffaf4]/90 dark:bg-[#182b25]/90 backdrop-blur-xs shadow-xs text-[#728077] dark:text-[#dce8e0] hover:text-red-500 transition cursor-pointer"
                    aria-label="Toggle favorite"
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
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#1f2f27] dark:text-[#f5f0e8] line-clamp-1 leading-snug hover:text-[#2f5d4a] dark:hover:text-[#f4c867] transition">
                    {name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#5d6f67] dark:text-[#c9d9d0] line-clamp-1 sm:line-clamp-2 mt-0.5 leading-tight">
                    {description || "Authentic freshly prepared traditional dish."}
                  </p>
                </div>
              </div>

              {/* Bottom Row: Price and Add Button */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#f0e6d8] dark:border-[#2d413b]">
                <span className="text-xs sm:text-sm font-extrabold text-[#1f2f27] dark:text-[#f5f0e8]">
                  ETB {price}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAvailable) addToCart(product, id);
                  }}
                  disabled={!isAvailable}
                  className={`flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isAvailable
                      ? cartAmount > 0
                        ? "bg-[#edf5ee] dark:bg-[#20352e] text-[#2f5d4a] dark:text-[#f4c867] hover:bg-[#f4efe9] dark:hover:bg-[#1e332e] border border-[#c8ddd0] dark:border-[#2d413b]"
                        : "bg-[#2f5d4a] hover:bg-[#1e4033] text-white shadow-xs active:scale-95"
                      : "bg-[#eadfc8] dark:bg-[#2c3b35] text-[#9aa8a1] cursor-not-allowed text-[10px]"
                  }`}
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

      {filteredDishes.length === 0 && (
        <div className="text-center py-16 bg-[#fffaf4] dark:bg-[#182b25] rounded-2xl border border-[#e8dcc5] dark:border-[#2d413b] mt-4">
          <p className="text-[#728077] dark:text-[#dce8e0] font-medium text-sm">
            No dishes found for this filter.
          </p>
          <button
            onClick={() => {
              setActiveCategory("All");
              setOnlyAvailable(false);
              setOnlySpicy(false);
            }}
            className="mt-3 px-4 py-2 bg-[#edf5ee] dark:bg-[#20352e] text-[#2f5d4a] dark:text-[#f4c867] text-xs font-bold rounded-xl hover:bg-[#f4efe9] dark:hover:bg-[#1e332e]"
          >
            Show All Dishes
          </button>
        </div>
      )}

      {/* Interactive Dish Detail Popup Modal */}
      {selectedDish && (
        <DishDetailModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </div>
  );
}

export default ProductList;

