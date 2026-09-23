import { useContext, useState } from "react";
import { ShopContext } from "../components/ShopContext";
import CartDetails from "./CartDetails";
import { FiTrash2, FiArrowRight, FiTag, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import MobileAppShell from "../components/MobileAppShell";

function Cart() {
  const {
    cart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    total,
    quantity,
    promo,
    applyPromoCode,
    removePromoCode,
  } = useContext(ShopContext);

  const [promoInput, setPromoInput] = useState("");

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyPromoCode(promoInput);
    if (ok) setPromoInput("");
  };

  if (!cart || cart.length === 0) {
    return (
      <MobileAppShell>
        <div className="customer-page max-w-[600px] mx-auto text-center py-20 px-4">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-2xl mx-auto mb-4">
            <FiShoppingBag />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Looks like you haven&apos;t added any delicious Ethiopian dishes yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <span>Explore Menu</span>
            <FiArrowRight />
          </Link>
        </div>
      </MobileAppShell>
    );
  }

  return (
    <MobileAppShell>
      <div className="customer-page cart-page max-w-[1000px] mx-auto px-4 py-6 sm:py-10">
        {/* Header matching reference image: "My Cart" + red items badge */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              My Cart
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
              {quantity} {quantity === 1 ? "Item" : "Items"}
            </span>
          </div>

          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition cursor-pointer"
            title="Clear all items from cart"
          >
            <FiTrash2 className="text-sm" />
            <span className="hidden sm:inline">Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-xs">
            <div className="divide-y divide-gray-100">
              {cart.map((item) => (
                <CartDetails key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
            {/* Promo Code Input matching reference design */}
            <div>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <FiTag className="absolute left-3 top-3 text-gray-400 text-xs" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter promo code (e.g. ABRON20)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {promo && (
                <div className="mt-2 flex items-center justify-between text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200">
                  <span>
                    Applied: <b>{promo.code}</b> ({promo.label})
                  </span>
                  <button
                    onClick={removePromoCode}
                    className="text-red-500 font-bold hover:underline ml-2"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Breakdown lines matching image */}
            <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">
                  ETB {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-gray-900">
                  {deliveryFee === 0 ? "FREE" : `ETB ${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-green-700 font-medium">
                <span>Discount</span>
                <span>- ETB {discount.toLocaleString()}</span>
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
                <span className="text-sm font-extrabold text-gray-900">
                  Total Amount
                </span>
                <span className="text-xl font-extrabold text-green-700">
                  ETB {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout button */}
            <Link
              to="/checkout"
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-green-600/25 transition-all text-center block cursor-pointer active:scale-95"
            >
              Proceed to Checkout
            </Link>

            {/* Browse Menu link */}
            <div className="text-center pt-1">
              <Link
                to="/"
                className="text-xs text-gray-500 hover:text-green-700 font-semibold"
              >
                ← Browse Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
}

export default Cart;

