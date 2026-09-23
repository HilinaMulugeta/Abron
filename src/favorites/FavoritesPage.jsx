import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FiHeart, FiShoppingBag, FiArrowLeft, FiCheck } from "react-icons/fi";
import { GiChiliPepper } from "react-icons/gi";
import MobileAppShell from "../components/MobileAppShell";
import { ShopContext } from "../components/ShopContext";
import UnavailabilityOverlay from "../components/UnavailabilityOverlay";
import DishDetailModal from "../components/DishDetailModal";

export default function FavoritesPage() {
  const { products, favorites, toggleFavorite, addToCart, isDishAvailable, cart } =
    useContext(ShopContext);

  const [selectedDish, setSelectedDish] = useState(null);

  const favoriteDishes = products.filter((p) => favorites.includes(p.id));

  const getItemCartAmount = (id) => {
    const item = cart.find((i) => String(i.id) === String(id));
    return item ? item.amount : 0;
  };

  return (
    <MobileAppShell>
      <div className="customer-page favorites-page max-w-[1240px] mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                to="/"
                className="text-gray-400 hover:text-green-700 text-xs font-bold flex items-center gap-1 transition"
              >
                <FiArrowLeft /> Back to Home
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
              <span className="text-red-500">
                <FaHeart />
              </span>
              <span>Saved Favorites</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Your handpicked Ethiopian favorites saved for instant 1-click ordering.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-red-50 text-red-600 border border-red-200 shadow-xs">
              {favoriteDishes.length} {favoriteDishes.length === 1 ? "Favorite" : "Favorites"}
            </span>
          </div>
        </div>

        {/* Empty State */}
        {favoriteDishes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              <FiHeart />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-1">
              No Favorites Saved Yet
            </h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
              Explore our traditional Ethiopian delicacies, freshly baked pizzas, or signature burgers and click the heart icon to save your loved dishes here.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-md shadow-green-600/20 transition cursor-pointer"
            >
              <FiShoppingBag className="text-sm" />
              <span>Explore Full Menu</span>
            </Link>
          </div>
        ) : (
          /* Dish Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {favoriteDishes.map((product) => {
              const { id, image, name, price, description, spicy, category } = product;
              const isAvailable = isDishAvailable(product);
              const cartAmount = getItemCartAmount(id);

              return (
                <div
                  key={id}
                  onClick={() => setSelectedDish(product)}
                  className={`bg-white border border-gray-100 rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md hover:border-green-200 cursor-pointer ${
                    !isAvailable ? "opacity-75" : ""
                  }`}
                >
                  <div>
                    <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-4/3 mb-2.5">
                      {/* Remove Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(id);
                        }}
                        className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/95 backdrop-blur-xs shadow-xs text-red-500 hover:scale-110 transition cursor-pointer"
                        title="Remove from favorites"
                        aria-label="Remove favorite"
                      >
                        <FaHeart className="text-xs" />
                      </button>

                      {/* Spicy Tag */}
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

                      {!isAvailable && (
                        <UnavailabilityOverlay
                          text="Unavailable Today"
                          size="small"
                        />
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        {category || "Specialty"}
                      </span>
                      <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 line-clamp-1 leading-snug hover:text-green-700 transition mt-0.5">
                        {name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1 sm:line-clamp-2 mt-0.5 leading-tight">
                        {description || "Authentic freshly prepared traditional dish."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-50">
                    <span className="text-xs sm:text-sm font-extrabold text-gray-900">
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
                            ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
                            : "bg-green-600 hover:bg-green-700 text-white shadow-xs active:scale-95 shadow-green-600/20"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed text-[10px]"
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
