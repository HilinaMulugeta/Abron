import { useContext, useMemo, useState, useEffect } from "react";
import {
  FiSearch,
  FiHeart,
  FiFilter,
  FiCheck,
  FiChevronDown,
  FiShoppingBag,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { GiChiliPepper } from "react-icons/gi";
import { Link, useSearchParams } from "react-router-dom";
import MobileAppShell from "../components/MobileAppShell";
import { ShopContext } from "../components/ShopContext";
import UnavailabilityOverlay from "../components/UnavailabilityOverlay";
import DishDetailModal from "../components/DishDetailModal";

export default function Search() {
  const { products, addToCart, isDishAvailable, toggleFavorite, isFavorite } =
    useContext(ShopContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlySpicy, setOnlySpicy] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [selectedDish, setSelectedDish] = useState(null);

  // Sync state if URL queryParam changes
  useEffect(() => {
    if (queryParam) setQuery(queryParam);
  }, [queryParam]);

  const category = categoryParam;

  const handleCategoryChange = (newCat) => {
    const nextParams = new URLSearchParams(searchParams);
    if (newCat && newCat !== "All") {
      nextParams.set("category", newCat);
    } else {
      nextParams.delete("category");
    }
    setSearchParams(nextParams);
  };

  const categories = useMemo(() => {
    const base = ["All", "Ethiopian", "Pizza", "Burgers", "Drinks"];
    const otherCats = [
      ...new Set(
        products
          .map((p) => p.category)
          .filter(Boolean)
          .filter(
            (c) => !["Pizza", "Burgers", "Drinks", "All", "Main"].includes(c)
          )
      ),
    ];
    return [...base, ...otherCats];
  }, [products]);

  const results = useMemo(() => {
    let list = products.filter((product) => {
      const nameLower = (product.name || "").toLowerCase();
      const catLower = (product.category || "").toLowerCase();
      const descLower = (product.description || "").toLowerCase();

      const matchesQuery =
        !query ||
        nameLower.includes(query.toLowerCase()) ||
        catLower.includes(query.toLowerCase()) ||
        descLower.includes(query.toLowerCase());

      const matchesCategory =
        category === "All" ||
        (category === "Ethiopian" &&
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
            nameLower.includes("tegabino"))) ||
        (category === "Pizza" &&
          (catLower === "pizza" || nameLower.includes("pizza"))) ||
        (category === "Burgers" &&
          (catLower.includes("burger") || nameLower.includes("burger"))) ||
        (category === "Drinks" &&
          (catLower.includes("drink") ||
            nameLower.includes("smoothy") ||
            nameLower.includes("shake") ||
            nameLower.includes("mojitto"))) ||
        catLower === category.toLowerCase();

      const available = isDishAvailable(product);
      const matchesAvailability = !onlyAvailable || available;
      const matchesSpicy = !onlySpicy || Boolean(product.spicy);

      return matchesQuery && matchesCategory && matchesAvailability && matchesSpicy;
    });

    if (sortBy === "price-low") {
      list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "name") {
      list = [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return list;
  }, [products, query, category, onlyAvailable, onlySpicy, sortBy, isDishAvailable]);

  return (
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
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer font-bold ${
                onlyAvailable
                  ? "bg-green-600 text-white border-green-600 shadow-xs"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              <FiFilter className="text-xs" /> Available Today
            </button>
            <button
              onClick={() => setOnlySpicy(!onlySpicy)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer font-bold ${
                onlySpicy
                  ? "bg-red-500 text-white border-red-500 shadow-xs"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              <GiChiliPepper className="text-sm" /> Spicy
            </button>

            {/* Sort selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none pr-7"
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes (e.g. Doro, Tibs, Shiro, Kitfo, Burger, Pizza)..."
              aria-label="Search dishes"
              className="w-full text-sm text-gray-900 placeholder-gray-400 bg-transparent border-0 outline-none font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 no-scrollbar">
          {categories.map((item) => {
            const isActive = category === item;
            return (
              <button
                key={item}
                onClick={() => handleCategoryChange(item)}
                className={`text-xs px-4 py-2 rounded-xl whitespace-nowrap transition font-bold cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-green-600 text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-bold text-gray-500">
            Showing <span className="text-gray-900 font-extrabold">{results.length}</span> {results.length === 1 ? "dish" : "dishes"}
          </p>
          {query && (
            <span className="text-xs text-green-700 font-semibold bg-green-50 px-2.5 py-0.5 rounded-full">
              Matching &ldquo;{query}&rdquo;
            </span>
          )}
        </div>

        {/* Dish Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {results.map((product) => {
            const isAvailable = isDishAvailable(product);
            const fav = isFavorite(product.id);

            return (
              <div
                key={product.id}
                onClick={() => setSelectedDish(product)}
                className={`bg-white border border-gray-100 rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md hover:border-green-200 cursor-pointer ${
                  !isAvailable ? "opacity-80" : ""
                }`}
              >
                {/* Image Container with Badges Inside */}
                <div>
                  <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-4/3 mb-2.5">
                    {/* Favorite Heart Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs shadow-xs text-gray-500 hover:text-red-500 transition flex items-center justify-center cursor-pointer"
                      aria-label="Toggle favorite"
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
                          : "text-gray-500 cursor-not-allowed"
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
                        {product.price} ETB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart CTA Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAvailable) addToCart(product, product.id);
                  }}
                  disabled={!isAvailable}
                  className={`w-full mt-3 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isAvailable
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-xs active:scale-95"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isAvailable ? (
                    <>
                      <FiShoppingBag className="text-xs" /> Add to cart
                    </>
                  ) : (
                    "Unavailable Today"
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {results.length === 0 && (
          <div className="search-empty text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 shadow-xs mt-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3 text-xl">
              <FiSearch />
            </div>
            <h3 className="text-sm font-bold text-gray-800 mb-1">
              No dishes found
            </h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
              We couldn&rsquo;t find any dishes matching &ldquo;{query}&rdquo;. Try another search term or reset filters.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setSearchParams({});
                setOnlyAvailable(false);
                setOnlySpicy(false);
                setSortBy("default");
              }}
              className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition cursor-pointer"
            >
              Reset All Filters
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
  );
}


