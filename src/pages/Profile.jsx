import { useState, useEffect, useContext } from "react";
import {
  FiChevronRight,
  FiCreditCard,
  FiHeart,
  FiLogOut,
  FiMapPin,
  FiSettings,
  FiUser,
  FiMoon,
  FiSun,
  FiGlobe,
  FiBell,
  FiTrash2,
  FiShoppingBag,
  FiCheck,
  FiEdit2,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import MobileAppShell from "../components/MobileAppShell";
import { ShopContext } from "../components/ShopContext";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";

export default function Profile() {
  const { orders, favorites, toggleFavorite, products, addToCart } =
    useContext(ShopContext);

  // Get auth functions
  const { user: authUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const defaultUser = {
    name: "Guest User",
    email: "guest@abron.com",
    phone: "+251 911 234 567",
    address: "23 Bole Road, Atlas Area, Addis Ababa",
    paymentMethod: "Cash on Delivery",
    language: "English",
    darkMode: false,
    notifications: true,
  };

  const [user, setUser] = useState(authUser || defaultUser);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  // Local settings that aren't part of auth
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("abron_user_settings");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      language: "English",
      darkMode: false,
      notifications: true,
    };
  });

  const [openPanel, setOpenPanel] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Edit Profile form state
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  // Saved addresses list
  const [addresses, setAddresses] = useState([
    { id: 1, label: "Home", text: "Gerji, Addis Ababa" },
    { id: 2, label: "Work", text: "Kazanchis, ECA Building, 4th Floor" },
    {
      id: 3,
      label: "Family",
      text: "CMC Michael, Tsehay Real Estate, Villa 12",
    },
  ]);
  const [newAddress, setNewAddress] = useState("");

  // Payment methods list
  const paymentMethods = [
    {
      id: "cod",
      name: "Cash on Delivery",
      desc: "Pay cash or Telebirr upon arrival",
      icon: "💵",
    },
    { id: "telebirr", name: "Telebirr", desc: "+251 911 *** 567", icon: "📱" },
    {
      id: "cbe",
      name: "CBE Birr",
      desc: "Commercial Bank of Ethiopia",
      icon: "🏦",
    },
    {
      id: "chapa",
      name: "Chapa / Card",
      desc: "Fast online checkout",
      icon: "💳",
    },
  ];

  // Keep local profile copy in sync; theme is owned by ThemeContext
  useEffect(() => {
    localStorage.setItem("abron_user_profile", JSON.stringify(user));
  }, [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, ...editForm }));
    setOpenPanel(null);
    toast.success("Profile updated successfully!");
  };

  const handleSelectAddress = (addrText) => {
    setUser((prev) => ({ ...prev, address: addrText }));
    toast.success(`Default delivery address set to: ${addrText.split(",")[0]}`);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    const newEntry = {
      id: Date.now(),
      label: "Other",
      text: newAddress.trim(),
    };
    setAddresses((prev) => [...prev, newEntry]);
    setUser((prev) => ({ ...prev, address: newEntry.text }));
    setNewAddress("");
    toast.success("New address added and selected!");
  };

  const handleSelectPayment = (methodName) => {
    setUser((prev) => ({ ...prev, paymentMethod: methodName }));
    toast.success(`Default payment updated to ${methodName}`);
  };

  const handleToggleDarkMode = () => {
    toggleTheme();
    setUser((prev) => ({ ...prev, darkMode: !isDarkMode }));
  };

  const handleToggleNotifications = () => {
    setUser((prev) => {
      const nextVal = !prev.notifications;
      toast.info(`Notifications turned ${nextVal ? "ON" : "OFF"}`);
      return { ...prev, notifications: nextVal };
    });
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout(); // Actually call the logout function
    toast.success("You have been logged out successfully!");
  };

  // Favorited dishes list
  const favoritedDishes = products.filter((p) => favorites.includes(p.id));

  const rows = [
    {
      key: "profile",
      icon: FiUser,
      label: "Personal information",
      badge: user.name,
    },
    {
      key: "address",
      icon: FiMapPin,
      label: "Saved addresses",
      badge: user.address.split(",")[0],
    },
    {
      key: "payment",
      icon: FiCreditCard,
      label: "Payment methods",
      badge: user.paymentMethod,
    },
    {
      key: "favorites",
      icon: FiHeart,
      label: "Favorite dishes",
      badge: `${favorites.length} saved`,
    },
    {
      key: "preferences",
      icon: FiSettings,
      label: "Notifications & preferences",
      badge: user.notifications ? "On" : "Off",
    },
  ];

  return (
    <MobileAppShell>
      <div className="customer-page profile-page max-w-xl mx-auto px-4 py-6 bg-[#f6efe7] text-[#1f2e28] dark:bg-[#111b18] dark:text-[#edf5ee]">
        {/* User Card */}
        <div className="profile-heading flex items-center justify-between p-4 bg-[#fffaf4] dark:bg-[#182b25] rounded-2xl border border-[#eadfc8] dark:border-[#2b3f37] shadow-[0_12px_28px_rgba(54,38,17,0.08)] mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[linear-gradient(135deg,#f3b63b_0%,#d56a2b_52%,#2f5d4a_100%)] text-white font-black text-xl flex items-center justify-center shadow-[0_10px_18px_rgba(212,137,44,0.25)]">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#2f5d4a] dark:text-[#f4c867] mb-0.5">
                My Profile
              </p>
              <h1 className="text-lg font-black text-[#1f2f27] dark:text-[#f5f0e8] leading-tight">
                {user.name}
              </h1>
              <span className="text-xs text-[#5d6f67] dark:text-[#dfe9df] font-medium">
                {user.email}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setEditForm({
                name: user.name,
                email: user.email,
                phone: user.phone,
              });
              setOpenPanel("profile");
            }}
            className="p-2.5 text-[#7d8a80] hover:text-[#2f5d4a] hover:bg-[#edf5ee] dark:text-[#dbe7de] dark:hover:text-[#f7cf6a] dark:hover:bg-[#20352e] rounded-xl transition cursor-pointer"
            title="Edit info"
          >
            <FiEdit2 className="text-base" />
          </button>
        </div>

        {/* Dynamic Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link
            to="/orders"
            className="bg-[#fffaf4] dark:bg-[#182b25] p-3.5 rounded-xl border border-[#e8dcc5] dark:border-[#2d413b] shadow-[0_10px_20px_rgba(24,35,30,0.05)] text-center hover:border-[#f0b84d] transition group"
          >
            <strong className="block text-xl font-black text-[#1f2f27] dark:text-[#f5f0e8] group-hover:text-[#2f5d4a]">
              {orders.length}
            </strong>
            <small className="text-[11px] font-semibold text-[#5d6f67] dark:text-[#c9d9d0]">
              Orders
            </small>
          </Link>
          <button
            onClick={() => setOpenPanel("favorites")}
            className="bg-[#fffaf4] dark:bg-[#182b25] p-3.5 rounded-xl border border-[#e8dcc5] dark:border-[#2d413b] shadow-[0_10px_20px_rgba(24,35,30,0.05)] text-center hover:border-[#f0b84d] transition group cursor-pointer"
          >
            <strong className="block text-xl font-black text-[#1f2f27] dark:text-[#f5f0e8] group-hover:text-[#d15d46]">
              {favorites.length}
            </strong>
            <small className="text-[11px] font-semibold text-[#5d6f67] dark:text-[#c9d9d0]">
              Favorites
            </small>
          </button>
          <div className="bg-[#fffaf4] dark:bg-[#182b25] p-3.5 rounded-xl border border-[#e8dcc5] dark:border-[#2d413b] shadow-[0_10px_20px_rgba(24,35,30,0.05)] text-center">
            <strong className="block text-xl font-black text-[#e0a632] dark:text-[#f4c867]">
              4.9 ★
            </strong>
            <small className="text-[11px] font-semibold text-[#5d6f67] dark:text-[#c9d9d0]">
              Rating
            </small>
          </div>
        </div>

        {/* Settings Navigation List */}
        <div className="bg-[#fffaf4] dark:bg-[#182b25] rounded-2xl border border-[#e8dcc5] dark:border-[#2d413b] shadow-[0_10px_20px_rgba(24,35,30,0.04)] divide-y divide-[#f0e6d8] dark:divide-[#2d413b] overflow-hidden mb-6">
          {rows.map(({ key, icon: Icon, label, badge }) => (
            <button
              key={key}
              onClick={() => {
                if (key === "profile") {
                  setEditForm({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                  });
                }
                setOpenPanel(key);
              }}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-[#f4efe9] dark:hover:bg-[#1e332e] transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#edf5ee] dark:bg-[#20352e] text-[#2f5d4a] dark:text-[#f4c867] flex items-center justify-center text-base">
                  <Icon />
                </div>
                <span className="text-xs font-bold text-[#24382f] dark:text-[#f5f0e8]">
                  {label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#728077] dark:text-[#dce8e0] font-medium truncate max-w-[130px]">
                  {badge}
                </span>
                <FiChevronRight className="text-[#9aa8a1] dark:text-[#e6e8e7] text-sm" />
              </div>
            </button>
          ))}
        </div>

        {/* Quick Preferences Toggles */}
        <div className="bg-[#fffaf4] dark:bg-[#182b25] p-4 rounded-2xl border border-[#e8dcc5] dark:border-[#2d413b] shadow-[0_10px_20px_rgba(24,35,30,0.04)] mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f6e7c2] dark:bg-[#2b352d] text-[#b78329] dark:text-[#f4c867] flex items-center justify-center text-base">
                {isDarkMode ? <FiMoon /> : <FiSun />}
              </div>
              <div>
                <p className="text-xs font-bold text-[#24382f] dark:text-[#f5f0e8]">
                  Dark Mode
                </p>
                <p className="text-[10px] text-[#6f7c75] dark:text-[#c4d3ca]">
                  Night theme display
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleDarkMode}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isDarkMode
                  ? "bg-[#2f5d4a]"
                  : "bg-[#dfe5df] dark:bg-[#2c3b35]"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isDarkMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="border-t border-[#f0e6d8] dark:border-[#2d413b] pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#eaf0fe] dark:bg-[#203140] text-[#4f73b6] dark:text-[#cfe0ff] flex items-center justify-center text-base">
                <FiBell />
              </div>
              <div>
                <p className="text-xs font-bold text-[#24382f] dark:text-[#f5f0e8]">
                  Order Updates
                </p>
                <p className="text-[10px] text-[#6f7c75] dark:text-[#c4d3ca]">
                  SMS & delivery alerts
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                user.notifications
                  ? "bg-[#2f5d4a]"
                  : "bg-[#dfe5df] dark:bg-[#2c3b35]"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  user.notifications ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Log Out CTA */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/70 font-bold text-xs rounded-xl transition cursor-pointer"
        >
          <FiLogOut className="text-base" /> Log out of account
        </button>

        {/* MODALS / PANELS */}

        {/* 1. Edit Personal Information Modal */}
        {openPanel === "profile" && (
          <div
            className="profile-modal-backdrop"
            onClick={() => setOpenPanel(null)}
          >
            <div
              className="profile-modal bg-white rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="profile-modal-close"
                onClick={() => setOpenPanel(null)}
              >
                <FiX />
              </button>
              <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="text-green-600" /> Personal Information
              </h2>
              <form onSubmit={handleSaveProfile} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOpenPanel(null)}
                    className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. Saved Addresses Modal */}
        {openPanel === "address" && (
          <div
            className="profile-modal-backdrop"
            onClick={() => setOpenPanel(null)}
          >
            <div
              className="profile-modal bg-white rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="profile-modal-close"
                onClick={() => setOpenPanel(null)}
              >
                <FiX />
              </button>
              <h2 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
                <FiMapPin className="text-green-600" /> Saved Delivery Addresses
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Select your default delivery drop-off location in Addis Ababa.
              </p>

              <div className="space-y-2.5 mb-5">
                {addresses.map((addr) => {
                  const isDefault = user.address === addr.text;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr.text)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-start justify-between gap-3 ${
                        isDefault
                          ? "border-green-600 bg-green-50/50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div>
                        <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm bg-gray-100 text-gray-700 mb-1">
                          {addr.label}
                        </span>
                        <p className="text-xs font-semibold text-gray-800">
                          {addr.text}
                        </p>
                      </div>
                      {isDefault && (
                        <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0 text-xs">
                          <FiCheck />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add New Address */}
              <form
                onSubmit={handleAddAddress}
                className="space-y-2 border-t border-gray-100 pt-4"
              >
                <label className="block text-[11px] font-bold text-gray-700">
                  + Add New Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gerji, Near Roba Bakery, House 402"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                >
                  Save & Select Address
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 3. Payment Methods Modal */}
        {openPanel === "payment" && (
          <div
            className="profile-modal-backdrop"
            onClick={() => setOpenPanel(null)}
          >
            <div
              className="profile-modal bg-white rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="profile-modal-close"
                onClick={() => setOpenPanel(null)}
              >
                <FiX />
              </button>
              <h2 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
                <FiCreditCard className="text-green-600" /> Payment Methods
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Select your preferred checkout method:
              </p>

              <div className="space-y-2.5">
                {paymentMethods.map((m) => {
                  const isSelected = user.paymentMethod === m.name;
                  return (
                    <div
                      key={m.id}
                      onClick={() => handleSelectPayment(m.name)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? "border-green-600 bg-green-50/50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{m.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-gray-900">
                            {m.name}
                          </p>
                          <p className="text-[10px] text-gray-500">{m.desc}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs">
                          <FiCheck />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setOpenPanel(null)}
                className="w-full mt-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* 4. Favorite Dishes Modal */}
        {openPanel === "favorites" && (
          <div
            className="profile-modal-backdrop"
            onClick={() => setOpenPanel(null)}
          >
            <div
              className="profile-modal bg-white rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="profile-modal-close"
                onClick={() => setOpenPanel(null)}
              >
                <FiX />
              </button>
              <h2 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
                <FiHeart className="text-red-500 fill-red-500" /> My Favorite
                Dishes
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Quick access to your all-time favorite Ethiopian meals.
              </p>

              {favoritedDishes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto mb-3 text-xl">
                    <FiHeart />
                  </div>
                  <p className="text-xs font-bold text-gray-700 mb-1">
                    No favorite dishes yet
                  </p>
                  <p className="text-[11px] text-gray-400 max-w-xs mx-auto mb-4">
                    Explore our menu and click the heart icon on any dish to
                    save it here!
                  </p>
                  <Link
                    to="/search"
                    onClick={() => setOpenPanel(null)}
                    className="inline-block px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700"
                  >
                    Browse Ethiopian Menu
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {favoritedDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 transition"
                    >
                      <img
                        src={dish.image || dish.img}
                        alt={dish.title}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {dish.title}
                        </h4>
                        <p className="text-[11px] font-extrabold text-green-700">
                          {dish.price} ETB
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            addToCart(dish);
                            toast.success(`Added ${dish.title} to cart!`);
                          }}
                          className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                        >
                          <FiShoppingBag className="text-xs" /> Add
                        </button>
                        <button
                          onClick={() => toggleFavorite(dish.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="Remove from favorites"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. Notifications & Preferences Modal */}
        {openPanel === "preferences" && (
          <div
            className="profile-modal-backdrop"
            onClick={() => setOpenPanel(null)}
          >
            <div
              className="profile-modal bg-white rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="profile-modal-close"
                onClick={() => setOpenPanel(null)}
              >
                <FiX />
              </button>
              <h2 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
                <FiSettings className="text-green-600" /> App Preferences
              </h2>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <FiGlobe className="text-gray-500" /> Language
                  </label>
                  <select
                    value={user.language}
                    onChange={(e) => {
                      setUser((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }));
                      toast.success(`Language set to ${e.target.value}`);
                    }}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="አማርኛ (Amharic)">አማርኛ (Amharic)</option>
                    <option value="Afaan Oromoo">Afaan Oromoo</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-700">
                    Live Order Notifications
                  </span>
                  <button
                    onClick={handleToggleNotifications}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      user.notifications ? "bg-green-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        user.notifications ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setOpenPanel(null)}
                className="w-full mt-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Log out confirmation modal */}
        {showLogoutModal && (
          <div
            className="profile-modal-backdrop"
            onClick={() => setShowLogoutModal(false)}
          >
            <div
              className="profile-modal bg-white rounded-2xl p-6 w-full max-w-xs text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3 text-xl">
                <FiLogOut />
              </div>
              <h3 className="text-base font-black text-gray-900 mb-1">
                Log Out?
              </h3>
              <p className="text-xs text-gray-500 mb-5">
                Are you sure you want to log out of Abron?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileAppShell>
  );
}
