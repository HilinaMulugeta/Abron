import { useState, useEffect, useContext } from "react";
import { BiCart } from "react-icons/bi";
import { FiSun, FiMoon } from "react-icons/fi";
import { ShopContext } from "./ShopContext";
import { Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { getThemeClass } from "../theme/components";

function NavBar() {
  const context = useContext(ShopContext);
  const { quantity = 0 } = context || {};
  const { isDarkMode, toggleTheme } = useTheme();

  // Early return if context is not available
  if (!context) {
    console.warn("NavBar: ShopContext not available");
  }

  const [isActive, setIsActive] = useState(false);

  const textClasses = getThemeClass('text', 'primary', isDarkMode);
  const headingClasses = getThemeClass('heading', 'primary', isDarkMode);
  const cardClasses = getThemeClass('card', 'base', isDarkMode);

  useEffect(() => {
    const handleScroll = () => {
      setIsActive(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex justify-between items-center px-4 md:px-20 py-4 md:py-8 w-full z-50 transition-all duration-300 
        ${isActive 
          ? `fixed top-0 ${cardClasses} shadow-xl py-3 md:py-5 px-4 md:px-10 backdrop-blur-lg` 
          : `relative ${isDarkMode ? 'bg-[#111b18]' : 'bg-[#f6efe7]'}`}`}
    >
      {/* Navigation Links */}
      <div className="hidden md:block">
        <ul className="flex gap-6">
          <li className={`text-lg font-semibold cursor-pointer ${textClasses} hover:text-[#2f5d4a] dark:hover:text-[#f4c867] transition-colors`}>
            <Link to="/">HOME</Link>
          </li>
          <li className={`text-lg font-semibold cursor-pointer ${textClasses} hover:text-[#2f5d4a] dark:hover:text-[#f4c867] transition-colors`}>
            <Link to="/search">DISHES</Link>
          </li>
        </ul>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[linear-gradient(135deg,#f3b63b_0%,#d56a2b_52%,#2f5d4a_100%)] text-white font-black text-lg md:text-xl flex items-center justify-center shadow-[0_8px_16px_rgba(212,137,44,0.25)]">
          A
        </div>
        <h2 className={`text-xl md:text-2xl font-black tracking-wide ${headingClasses}`}>
          ABRON
        </h2>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Cart */}
        <Link to="/cart">
          <div className="relative cursor-pointer">
            <BiCart className={`text-2xl md:text-3xl ${textClasses} hover:text-[#2f5d4a] dark:hover:text-[#f4c867] transition-colors`} />
            {quantity > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#2f5d4a] text-white text-xs h-5 w-5 items-center flex justify-center rounded-full font-bold shadow-lg">
                {quantity > 99 ? '99+' : quantity}
              </span>
            )}
          </div>
        </Link>
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg ${textClasses} hover:bg-[#edf5ee] dark:hover:bg-[#20352e] transition-colors`}
          title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
        </button>
      </div>
    </div>
  );
}

export default NavBar;
