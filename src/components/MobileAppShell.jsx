import { useContext } from "react";
import {
  FiHome,
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiShield,
  FiHeart,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { ShopContext } from "./ShopContext";
import { useTheme } from "../theme/ThemeContext";
import { getThemeClass } from "../theme/components";
import ThemeToggle from "../theme/ThemeToggle";
import Footer from "./Footer";
import "./customer.css";

export default function MobileAppShell({ children }) {
  const context = useContext(ShopContext);
  const { quantity = 0, orders = [], favorites = [] } = context || {};
  const location = useLocation();
  const { isDarkMode } = useTheme();

  // Early return if context is not available
  if (!context) {
    console.warn("MobileAppShell: ShopContext not available");
  }

  const textClasses = getThemeClass('text', 'primary', isDarkMode);
  const headingClasses = getThemeClass('heading', 'primary', isDarkMode);
  const mutedClasses = getThemeClass('text', 'muted', isDarkMode);
  const accentClasses = getThemeClass('text', 'accent', isDarkMode);

  const items = [
    { label: "Home", icon: FiHome, to: "/" },
    { label: "Menu", icon: FiSearch, to: "/menu" },
    { label: "Favorites", icon: FiHeart, to: "/favorites" },
    { label: "Orders", icon: FiShoppingBag, to: "/orders" },
    { label: "Profile", icon: FiUser, to: "/profile" },
  ];

  const activeOrdersCount = orders.filter(
    (o) => o.status === "Preparing" || o.status === "On the Way",
  ).length;

  return (
    <div className="customer-app">
      {/* Fixed Header */}
      <header className="customer-topbar">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="customer-logo flex items-center gap-2.5 text-decoration-none group"
          >
            <span className="customer-logo-badge flex items-center justify-center w-4 h-2 rounded-lg bg-[linear-gradient(135deg,#f3b63b_0%,#d56a2b_52%,#2f5d4a_100%)] text-white font-serif font-black text-base shadow-[0_8px_18px_rgba(211,128,48,0.25)] shrink-0 transition">
              <img src="favicon.ico" alt="abron" className="h-10 w-10" />
            </span>
            <span className={`customer-logo-text font-black text-lg tracking-tight ${headingClasses}`}>
              ABR<span className="text-[#d77a2f]">ON</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="customer-desktop-nav">
            {items.map(({ label, to }) => {
              const active =
                (to === "/" && location.pathname === "/") ||
                (to === "/menu" &&
                  (location.pathname === "/menu" ||
                    location.pathname === "/search")) ||
                (location.pathname.startsWith(to.split("#")[0]) && to !== "/");
              return (
                <Link
                  key={label}
                  to={to}
                  className={`text-xs font-bold transition px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                    active
                      ? `${accentClasses} ${isDarkMode ? 'bg-[#213b34]' : 'bg-[#eef5ef]'}`
                      : `${mutedClasses} hover:text-[#d77a2f] dark:hover:text-[#f4c867] ${isDarkMode ? 'hover:bg-[#1b2d29]' : 'hover:bg-[#f7efe6]'}`
                  }`}
                >
                  {label}
                  {label === "Favorites" && favorites.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] bg-red-500 text-white rounded-full font-extrabold">
                      {favorites.length}
                    </span>
                  )}
                  {label === "Orders" && activeOrdersCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[9px] bg-[#2f5d4a] text-white rounded-full">
                      {activeOrdersCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            to="/search"
            className={`p-2 ${mutedClasses} hover:text-[#d77a2f] dark:hover:text-[#f4c867] transition rounded-lg ${isDarkMode ? 'hover:bg-[#1b2d29]' : 'hover:bg-[#f7efe6]'}`}
            aria-label="Search menu"
            title="Search dishes"
          >
            <FiSearch className="text-lg" />
          </Link>

          {/* Favorites quick header icon */}
          <Link
            to="/favorites"
            className={`p-2 ${mutedClasses} hover:text-[#d15d46] dark:hover:text-[#f6b1a7] transition rounded-lg ${isDarkMode ? 'hover:bg-[#1b2d29]' : 'hover:bg-[#f7efe6]'} relative`}
            aria-label="Favorites"
            title="Saved Dishes"
          >
            <FiHeart className="text-lg" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[9px] font-extrabold text-white bg-red-500 rounded-full shadow-xs">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link
            to="/admin/dashboard"
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${isDarkMode ? 'bg-[#1b2d29] text-[#e9f4ec] hover:bg-[#223b35] hover:text-[#f4c867]' : 'bg-[#f3efe9] text-[#3e4e49] hover:bg-[#edf5ef] hover:text-[#2f5d4a]'} transition`}
            title="Admin Dashboard"
          >
            <FiShield className={`text-xs ${isDarkMode ? 'text-[#f4c867]' : 'text-[#d77a2f]'}`} />
            <span>Admin</span>
          </Link>

          {/* Shopping Cart Button with Dynamic Badge */}
          <Link
            to="/cart"
            className={`customer-cart-link p-2 ${textClasses} hover:text-[#d77a2f] dark:hover:text-[#f4c867] transition relative`}
            aria-label="Open cart"
          >
            <FiShoppingBag className="text-xl" />
            {quantity > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold text-white bg-red-500 rounded-full shadow-xs animate-in zoom-in-75">
                {quantity}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="customer-content">{children}</main>

      {/* Modern Pinned Footer */}
      <Footer />

      {/* Mobile Fixed Bottom Navigation */}
      <nav className="customer-bottom-nav">
        {items.map(({ label, icon: Icon, to }) => {
          const active =
            (to === "/" && location.pathname === "/") ||
            (to === "/menu" &&
              (location.pathname === "/menu" ||
                location.pathname === "/search")) ||
            (location.pathname.startsWith(to.split("#")[0]) && to !== "/");
          return (
            <Link key={label} to={to} className={active ? "is-active" : ""}>
              <div className="relative">
                <Icon />
                {label === "Favorites" && favorites.length > 0 && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-red-500" />
                )}
                {label === "Orders" && activeOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-green-500" />
                )}
              </div>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
