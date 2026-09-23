import { useContext } from "react";
import { ShopContext } from "../components/ShopContext";
import { useParams, Link } from "react-router-dom";
import { FiChevronLeft, FiHeart, FiClock, FiCheckCircle } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { GiChiliPepper } from "react-icons/gi";
import MobileAppShell from "../components/MobileAppShell";
import UnavailabilityOverlay from "../components/UnavailabilityOverlay";

function ProductDetails() {
  const { products, addToCart, isDishAvailable, toggleFavorite, isFavorite } =
    useContext(ShopContext);
  const { id } = useParams();
  const product = products.find((p) => String(p.id) === String(id));

  if (!product) {
    return (
      <MobileAppShell>
        <div className="customer-page text-center py-20 px-4">
          <p className="text-xl text-gray-600 font-medium">Dish not found...</p>
          <Link
            to="/"
            className="inline-block mt-4 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700"
          >
            Back to Menu
          </Link>
        </div>
      </MobileAppShell>
    );
  }

  const isAvailable = isDishAvailable(product);
  const fav = isFavorite(product.id);

  return (
    <MobileAppShell>
      <div className="customer-page max-w-[1100px] mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-green-700 mb-6 transition-colors"
        >
          <FiChevronLeft className="text-lg" /> Back to menu
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-xs">
          {/* Image Container */}
          <div className="relative flex justify-center bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            {/* Heart Favorite Button */}
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/90 backdrop-blur-xs shadow-md text-gray-500 hover:text-red-500 transition cursor-pointer"
              aria-label="Toggle favorite"
            >
              {fav ? (
                <FaHeart className="text-red-500 text-lg" />
              ) : (
                <FiHeart className="text-lg" />
              )}
            </button>

            {/* Spicy Badge */}
            {product.spicy && (
              <div className="absolute top-4 left-4 z-30 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                <GiChiliPepper className="text-sm" />
                <span>Spicy Dish</span>
              </div>
            )}

            <img
              src={product.image}
              alt={product.name}
              className={`w-full max-w-[460px] h-[300px] sm:h-[400px] object-cover rounded-xl transition duration-300 ${
                !isAvailable ? "blur-[2px] grayscale-[30%]" : "hover:scale-102"
              }`}
            />

            {!isAvailable && (
              <UnavailabilityOverlay
                text="Currently Unavailable Today"
                size="large"
              />
            )}
          </div>

          {/* Dish Details */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
                {product.category || "Traditional Ethiopian"}
              </span>
              {isAvailable ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                  <FiCheckCircle /> Available Today
                </span>
              ) : (
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                  Out of Stock Today
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              {product.name}
            </h1>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-4">
              {product.description ||
                "A delicious Ethiopian staple prepared freshly with traditional spices, pure niter kibbeh, and served hot."}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <FiClock className="text-green-600" /> Prep time: 20-35 mins
              </span>
              <span>•</span>
              <span>Authentic Recipe</span>
            </div>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-green-700">
                ETB {product.price}
              </span>
            </div>

            <div className="mt-8">
              <button
                onClick={() =>
                  isAvailable ? addToCart(product, product.id) : null
                }
                disabled={!isAvailable}
                className={`w-full sm:w-auto px-10 py-3.5 text-base font-bold rounded-xl shadow-md transition-all ${
                  isAvailable
                    ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer active:scale-95 shadow-green-600/25"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                }`}
              >
                {isAvailable ? "Add To Cart" : "Unavailable Today"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
}

export default ProductDetails;

