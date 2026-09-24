import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  FiX,
  FiClock,
  FiShoppingBag,
  FiHeart,
  FiExternalLink,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { GiChiliPepper, GiCookingPot } from "react-icons/gi";
import { ShopContext } from "./ShopContext";
import UnavailabilityOverlay from "./UnavailabilityOverlay";

export default function DishDetailModal({ dish, onClose }) {
  const { addToCart, isDishAvailable, toggleFavorite, isFavorite } =
    useContext(ShopContext);
  const [amount, setAmount] = useState(1);

  if (!dish) return null;

  const isAvailable = isDishAvailable(dish);
  const fav = isFavorite(dish.id);

  const handleAddToCart = () => {
    if (!isAvailable) return;
    for (let i = 0; i < amount; i++) {
      addToCart(dish, dish.id);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#132418] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-[#213828] relative max-h-[90vh] flex flex-col animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center transition cursor-pointer backdrop-blur-xs"
          aria-label="Close dialog"
        >
          <FiX className="text-lg" />
        </button>

        {/* Dish Image Header */}
        <div className="relative h-60 sm:h-72 w-full bg-gray-100 dark:bg-gray-800 shrink-0 overflow-hidden">
          <img
            src={dish.image || dish.img}
            alt={dish.name || dish.title}
            className={`w-full h-full object-cover ${
              !isAvailable ? "blur-[1.5px] grayscale-[25%]" : ""
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

          {/* Floating Favorite button */}
          <button
            onClick={() => toggleFavorite(dish.id)}
            className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-xs flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-red-500 shadow-sm cursor-pointer transition"
            aria-label="Toggle favorite"
          >
            {fav ? <FaHeart className="text-red-500 text-sm" /> : <FiHeart className="text-sm" />}
          </button>

          {/* Spicy tag */}
          {dish.spicy && (
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs">
              <GiChiliPepper className="text-sm" />
              <span>Spicy Specialty</span>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!isAvailable && (
            <UnavailabilityOverlay
              text="Unavailable Today"
              size="default"
            />
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-green-700 dark:text-green-400">
                {dish.category || "Authentic Cuisine"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-tight mt-0.5">
                {dish.name || dish.title}
              </h2>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg sm:text-xl font-black text-green-700 dark:text-green-400 block">
                ETB {dish.price}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold block">
                VAT included
              </span>
            </div>
          </div>

          {/* Badges Bar */}
          <div className="flex items-center gap-3 py-2 border-y border-gray-100 dark:border-[#213828] text-xs text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-1 font-bold text-green-700 dark:text-green-400">
              {dish.availableToday === false ? "Currently unavailable" : "Available to order"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <FiClock className="text-green-600" /> 25 – 35 mins prep
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <GiCookingPot className="text-amber-600" /> Fresh
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-1">
              Description
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {dish.description ||
                "A delicious, slow-cooked authentic meal freshly prepared with organic spices, pure clarified spiced butter, and served with freshly baked injera."}
            </p>
          </div>

          {/* Traditional Serving Notes */}
          <div className="bg-green-50/60 dark:bg-[#193220] p-3 rounded-2xl border border-green-100 dark:border-[#24472d] text-xs text-green-900 dark:text-green-200">
            <p className="font-bold mb-0.5">🌿 Authentic Recipe</p>
            <p className="text-[11px] text-green-800/80 dark:text-green-300/80">
              Prepared to order using natural Ethiopian mountain herbs and berbere spice blend.
            </p>
          </div>

          {/* Quantity & CTA Section */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center justify-between border border-gray-200 dark:border-[#24472d] rounded-xl px-3 py-2 w-full sm:w-auto gap-4 bg-gray-50 dark:bg-[#172c1c]">
              <span className="text-xs font-bold text-gray-500 sm:hidden">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAmount((a) => Math.max(1, a - 1))}
                  disabled={amount <= 1 || !isAvailable}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-[#203c26] text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  <FiMinus className="text-xs" />
                </button>
                <span className="font-extrabold text-sm text-gray-900 dark:text-white min-w-[20px] text-center">
                  {amount}
                </span>
                <button
                  type="button"
                  onClick={() => setAmount((a) => a + 1)}
                  disabled={!isAvailable}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-[#203c26] text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  <FiPlus className="text-xs" />
                </button>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`flex-1 w-full py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                isAvailable
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/30 active:scale-98"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FiShoppingBag className="text-sm" />
              <span>
                {isAvailable
                  ? `Add to Cart • ETB ${((dish.price || 0) * amount).toLocaleString()}`
                  : "Unavailable Today"}
              </span>
            </button>
          </div>

          {/* Full Page Link */}
          <div className="text-center pt-2">
            <Link
              to={`/product/${dish.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-green-700 dark:hover:text-green-400 transition"
            >
              <span>Open dedicated product details page</span>
              <FiExternalLink className="text-xs" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
