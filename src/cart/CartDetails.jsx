import React, { useContext } from "react";
import { ShopContext } from "../components/ShopContext";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

function CartDetails({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } =
    useContext(ShopContext);

  const { id, name, image, price, amount, description } = item;

  return (
    <div className="flex items-center justify-between gap-3 py-4 border-b border-gray-100 last:border-b-0">
      {/* Thumbnail + Name */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
            {name}
          </h3>
          <p className="text-[11px] text-gray-400 truncate max-w-[160px] sm:max-w-xs">
            {description ? description.slice(0, 38) + "..." : `Traditional dish • ${amount}`}
          </p>
          <span className="text-xs sm:text-sm font-extrabold text-green-700 block mt-1">
            ETB {price}
          </span>
        </div>
      </div>

      {/* Stepper & Trash Icon */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => decreaseQuantity(id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-gray-700 transition cursor-pointer"
            title="Decrease quantity"
            aria-label="Decrease"
          >
            <FiMinus className="text-xs" />
          </button>
          <span className="w-7 text-center text-xs font-bold text-gray-900">
            {amount}
          </span>
          <button
            onClick={() => increaseQuantity(id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-gray-700 transition cursor-pointer"
            title="Increase quantity"
            aria-label="Increase"
          >
            <FiPlus className="text-xs" />
          </button>
        </div>

        <button
          onClick={() => removeFromCart(id)}
          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer"
          title="Remove from cart"
          aria-label="Remove item"
        >
          <FiTrash2 className="text-base" />
        </button>
      </div>
    </div>
  );
}

export default CartDetails;

