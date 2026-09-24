import { useContext, useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiCreditCard,
  FiDollarSign,
  FiSmartphone,
  FiX,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../components/ShopContext";
import { useAuth } from "../auth/AuthContext";
import LoginSignupModal from "../auth/LoginSignupModal";
import MobileAppShell from "../components/MobileAppShell";

export default function Checkout() {
  // ALL HOOKS MUST BE CALLED FIRST - NO EARLY RETURNS BEFORE THIS POINT
  const context = useContext(ShopContext);
  const { 
    cart = [], 
    total = 0, 
    subtotal = 0, 
    deliveryFee = 0, 
    discount = 0, 
    promo = null,
    addOrder, 
    setSelectedArea, 
    AREA_DELIVERY_FEES = {} 
  } = context || {};
  const navigate = useNavigate();
  
  // Authentication check - HOOK MUST BE CALLED UNCONDITIONALLY
  const { user, loading: authLoading, updateProfile } = useAuth();
  
  // ALL STATE HOOKS MUST BE CALLED UNCONDITIONALLY
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryArea, setDeliveryArea] = useState(user?.area || "Bole");
  const [address, setAddress] = useState(user?.address || "");
  const [instructions, setInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  
  // ALL DYNAMIC PAYMENT FORM STATES
  const [telebirrPhone, setTelebirrPhone] = useState("");
  const [cbeBirrAccount, setCbeBirrAccount] = useState("");
  const [cashChangeOption, setCashChangeOption] = useState("Exact change");

  // ALL USEEFFECT HOOKS MUST BE CALLED UNCONDITIONALLY
  // Check if user is logged in, if not show login modal
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setShowLoginModal(true);
        toast.info('Please login or sign up to proceed with checkout');
      } else {
        setShowLoginModal(false);
      }
    }
  }, [user, authLoading]);

  // Pre-populate form with user data when logged in
  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setPhoneNumber(user.phone || "");
      setDeliveryArea(user.area || "Bole");
      setAddress(user.address || "");
    }
  }, [user]);

  // Keep ShopContext delivery area in sync with selected area
  useEffect(() => {
    if (setSelectedArea && deliveryArea) {
      setSelectedArea(deliveryArea);
    }
  }, [deliveryArea, setSelectedArea]);

  // Handle navigation in useEffect to prevent hook violations
  useEffect(() => {
    // Only redirect to cart if user explicitly closed modal without logging in
    if (!authLoading && !user && !showLoginModal) {
      const timer = setTimeout(() => {
        navigate('/cart');
      }, 1000); // Give a short delay for better UX
      
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, showLoginModal, navigate]);

  // NOW WE CAN DO CONDITIONAL RENDERING - AFTER ALL HOOKS ARE CALLED
  
  // Early return if context is not available
  if (!context) {
    console.warn('Checkout: ShopContext not available');
    return (
      <MobileAppShell>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-gray-600">Unable to load checkout. Please try again.</p>
            <Link 
              to="/cart"
              className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  // If authentication is loading, show loading state
  if (authLoading) {
    return (
      <MobileAppShell>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  // If not logged in, show checkout form but with login modal
  // The modal will handle the authentication
  if (!user && !authLoading) {
    // Don't redirect immediately, let the modal handle auth first
  }

  // Popular addresses for the modal
  const popularAddresses = [
    "Bole Medhanialem, Edna Mall area, Addis Ababa",
    "Kazanchis, Near ECA Building, Addis Ababa",
    "Sarbet, Near Vatican Embassy, Addis Ababa",
    "Piassa, Churchill Avenue, Addis Ababa",
    "CMC Michael, Sunshine Real Estate, Addis Ababa",
  ];

  // Feature 10: Form Validation before submit
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cart.length) {
      toast.error("Your cart is empty. Add a dish before checking out.");
      navigate("/menu");
      return;
    }
    if (!fullName || fullName.trim().length < 3) {
      toast.error("Please enter your full name (minimum 3 characters).");
      return;
    }

    const cleanPhone = phoneNumber.replace(/[\s\-()]/g, "");
    const ethiopianPhoneRegex = /^(\+251|0)?[79]\d{8}$/;
    if (!ethiopianPhoneRegex.test(cleanPhone)) {
      toast.error("Please enter a valid Ethiopian phone number (e.g. 09... or 07...).");
      return;
    }

    if (!address || address.trim().length < 5) {
      toast.error("Please provide a valid delivery street address.");
      return;
    }

    let paymentInfo = "";
    if (paymentMethod === "Telebirr") paymentInfo = `Telebirr (${telebirrPhone})`;
    else if (paymentMethod === "CBE Birr") paymentInfo = `CBE Birr (${cbeBirrAccount})`;
    else if (paymentMethod === "Card on Delivery") paymentInfo = "Card on delivery";
    else paymentInfo = `Cash (${cashChangeOption})`;

    try {
    await updateProfile({ name: fullName.trim(), phone: phoneNumber.trim(), area: deliveryArea, address: address.trim() });
    } catch (error) {
      toast.error(error.message || "Could not save your delivery details.");
      return;
    }

    const areaFee = promo?.type === "free_shipping" ? 0 : (AREA_DELIVERY_FEES[deliveryArea] ?? deliveryFee);
    const orderSubtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.amount ?? item.quantity) || 1), 0);
    const orderDiscount = discount;
    const newOrder = addOrder({
      customer: fullName.trim(),
      phone: phoneNumber.trim(),
      address: address.trim(),
      area: deliveryArea,
      userId: user.id,
      customerEmail: user.email,
      subtotal: orderSubtotal,
      deliveryFee: areaFee,
      discount: orderDiscount,
      total: Math.max(0, orderSubtotal + areaFee - orderDiscount),
      paymentMethod,
      paymentInfo,
      instructions,
    });

    toast.success("Order placed successfully!");
    navigate("/order-confirmed", { state: { order: newOrder } });
  };

  return (
    <MobileAppShell>
      <div className="customer-page checkout-page max-w-[650px] mx-auto px-4 py-6 sm:py-10">
        {/* Top Header & Step Indicator matching reference */}
        <div className="flex items-center justify-between mb-6 pb-2">
          <Link
            to="/cart"
            className="flex items-center gap-1.5 text-sm font-bold text-gray-900 hover:text-green-700"
          >
            <FiChevronLeft className="text-lg" /> Checkout
          </Link>

          {/* Steps dots (active, inactive) */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-5">
          {/* Delivery Address Card matching design */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center text-lg shrink-0">
                <FiMapPin />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">
                  Delivery Address
                </span>
                <strong className="text-xs sm:text-sm font-bold text-gray-900 block mt-0.5">
              {address || `${deliveryArea}, Addis Ababa`}
                </strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAddressModalOpen(true)}
              className="text-xs font-bold text-green-600 hover:text-green-700 cursor-pointer shrink-0"
            >
              Change
            </button>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Abebe Kebede"
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-green-500 shadow-xs font-medium"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+251 911 234 567"
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-green-500 shadow-xs font-medium"
            />
          </div>

          {/* Delivery Area Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Delivery Area
            </label>
            <select
              value={deliveryArea}
              onChange={(e) => {
                setDeliveryArea(e.target.value);
                setAddress(`${e.target.value}, Addis Ababa`);
              }}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-green-500 shadow-xs font-medium cursor-pointer"
            >
              {Object.entries(AREA_DELIVERY_FEES).map(([area, fee]) => <option key={area} value={area}>{area} — ETB {fee}</option>)}
            </select>
          </div>

          {/* Estimated Delivery Time Card matching reference */}
          <div className="flex items-center gap-3 bg-green-50/80 border border-green-200/80 rounded-2xl p-3 text-xs text-green-900 font-semibold">
            <FiClock className="text-green-700 text-base shrink-0" />
            <span>
              Estimated Delivery Time: <b>30 – 45 mins</b>
            </span>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Special Instructions
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Please bring extra spicy Awaze sauce..."
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-green-500 shadow-xs"
            />
          </div>

          {/* Payment Method Selector matching reference */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                { label: "Telebirr", icon: FiSmartphone, badge: "Instant" },
                { label: "CBE Birr", icon: FiCheckCircle, badge: "USSD" },
                { label: "Card on Delivery", icon: FiCreditCard, badge: "At handoff" },
                {
                  label: "Cash on Delivery",
                  icon: FiDollarSign,
                  badge: "Cash",
                },
              ].map(({ label, icon: Icon, badge }) => {
                const selected = paymentMethod === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setPaymentMethod(label)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition cursor-pointer text-left ${
                      selected
                        ? "bg-green-50/90 border-green-600 text-green-900 shadow-xs ring-2 ring-green-600/20"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon
                        className={
                          selected
                            ? "text-green-600 text-base"
                            : "text-gray-400 text-base"
                        }
                      />
                      <span className="truncate">{label}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                        selected
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Form for Telebirr */}
            {paymentMethod === "Telebirr" && (
              <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-4 space-y-3 animate-in fade-in-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-900 font-extrabold text-xs">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                    <span>Telebirr payment preference</span>
                  </div>
                  <span className="text-[10px] bg-sky-600 text-white px-2 py-0.5 rounded-full font-bold">
                    Confirm after order
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Telebirr Registered Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-bold">
                      +251
                    </span>
                    <input
                      type="tel"
                      required
                      value={telebirrPhone}
                      onChange={(e) => setTelebirrPhone(e.target.value)}
                      placeholder="91 123 4567"
                      className="w-full bg-white border border-sky-300 rounded-xl pl-14 pr-3 py-2 text-xs text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="bg-white/80 rounded-xl p-2.5 text-[11px] text-sky-950 border border-sky-200/60 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <FiSmartphone className="text-sky-600" />
                    How to pay:
                  </p>
                  <p className="text-gray-600 text-[10px] leading-relaxed pl-4">
                    Your order will be placed with Telebirr selected. Abron will confirm payment instructions with you; no payment is charged here.
                  </p>
                </div>
              </div>
            )}

            {/* Dynamic Form for CBE Birr */}
            {paymentMethod === "CBE Birr" && (
              <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4 space-y-3 animate-in fade-in-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span>Commercial Bank of Ethiopia (CBE Birr)</span>
                  </div>
                  <span className="text-[10px] bg-purple-700 text-white px-2 py-0.5 rounded-full font-bold">
                    *847#
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    CBE Birr Mobile / Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cbeBirrAccount}
                    onChange={(e) => setCbeBirrAccount(e.target.value)}
                    placeholder="0911234567 or 1000..."
                    className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                  />
                </div>

                <div className="bg-white/80 rounded-xl p-2.5 text-[11px] text-purple-950 border border-purple-200/60 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <FiCheckCircle className="text-purple-600" />
                    CBE Birr payment preference:
                  </p>
                  <p className="text-gray-600 text-[10px] leading-relaxed pl-4">
                    Abron will confirm payment instructions after you place the order. No payment is charged here.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === "Card on Delivery" && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Pay by card when the delivery arrives. Card details are not collected on this page.</p>}

            {/* Dynamic Form for Cash on Delivery */}
            {paymentMethod === "Cash on Delivery" && (
              <div className="bg-green-50/60 border border-green-200 rounded-2xl p-4 space-y-3 animate-in fade-in-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-900 font-extrabold text-xs">
                    <FiDollarSign className="text-green-600 text-base" />
                    <span>Cash on Handover</span>
                  </div>
                  <span className="text-[10px] bg-green-700 text-white px-2 py-0.5 rounded-full font-bold">
                    ABRON Delivery
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Do you require change?
                  </label>
                  <select
                    value={cashChangeOption}
                    onChange={(e) => setCashChangeOption(e.target.value)}
                    className="w-full bg-white border border-green-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 shadow-xs cursor-pointer"
                  >
                    <option value="Exact change">
                      I have exact change (ETB {total.toLocaleString()})
                    </option>
                    <option value="Change for 500 ETB">
                      Need change for ETB 500
                    </option>
                    <option value="Change for 1,000 ETB">
                      Need change for ETB 1,000
                    </option>
                    <option value="Change for 2,000 ETB">
                      Need change for ETB 2,000
                    </option>
                  </select>
                </div>

                <p className="text-gray-500 text-[10px] leading-relaxed">
                  Our dispatch rider will provide a printed receipt and collect
                  cash upon food arrival.
                </p>
              </div>
            )}
          </div>

          {/* Cost Summary Breakdown */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs text-gray-600 border border-gray-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">
                ETB {subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee ({deliveryArea})</span>
              <span className="font-bold text-gray-900">ETB {deliveryFee}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-700 font-bold">
                <span>Discount</span>
                <span>- ETB {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 text-sm font-extrabold text-gray-900">
              <span>Total Amount</span>
              <span className="text-lg text-green-700 font-extrabold">
                ETB {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Place Order Button matching reference */}
          <button
            type="submit"
            disabled={cart.length === 0}
            className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold text-sm rounded-xl shadow-md shadow-green-600/25 transition-all text-center cursor-pointer active:scale-98"
          >
            Place Order → ETB {total.toLocaleString()}
          </button>
        </form>

        {/* Change Address Modal */}
        {addressModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl relative">
              <button
                onClick={() => setAddressModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                <FiX />
              </button>
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Select Delivery Location
              </h3>
              <label className="block text-xs font-semibold text-gray-700 mb-3">Street address or nearby landmark
                <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Building, street, or landmark" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              </label>
              <button type="button" onClick={() => setAddressModalOpen(false)} className="w-full rounded-lg bg-green-700 px-3 py-2 text-xs font-bold text-white mb-3">Save address</button>
              <div className="space-y-2 text-xs">
                {popularAddresses.map((addr) => (
                  <button
                    key={addr}
                    onClick={() => {
                      setAddress(addr);
                      setAddressModalOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 text-gray-700 transition cursor-pointer"
                  >
                    {addr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login/Signup Modal */}
      <LoginSignupModal
        isOpen={showLoginModal}
        initialMode="signup"
        onClose={(redirectPath) => {
          setShowLoginModal(false);
          // If login was successful (redirectPath provided), stay on checkout
          // If modal was just closed without login, redirect to cart
          if (!redirectPath && !user) {
            navigate("/cart");
          }
        }}
        redirectTo="/checkout"
      />
    </MobileAppShell>
  );
}

