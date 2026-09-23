import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiClock,
  FiStar,
  FiArrowRight,
  FiZap,
  FiCheckCircle,
} from "react-icons/fi";
import { GiMeal, GiChiliPepper } from "react-icons/gi";
import { useTheme } from "../theme/ThemeContext";
import { getThemeClass } from "../theme/components";

function Hero() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState("");
  const { isDarkMode } = useTheme();

  const headingClasses = getThemeClass('heading', 'primary', isDarkMode);
  const textClasses = getThemeClass('text', 'primary', isDarkMode);
  const mutedClasses = getThemeClass('text', 'muted', isDarkMode);
  const inputClasses = getThemeClass('input', 'base', isDarkMode);

  // Determine greeting based on current local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning, Hilina";
    if (hour < 18) return "Good Afternoon, Hilina";
    return "Good Evening, Hilina";
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/menu?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/menu");
    }
  };

  return (
    <div className="customer-hero-section w-full pt-4 pb-8">
      {/* Personalized Greeting Header - Profile.jsx Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight ${headingClasses}`}>
            {greeting}
          </h1>
          <p className={`text-xs sm:text-sm font-medium mt-0.5 ${mutedClasses}`}>
            What would you like to eat today?
          </p>
        </div>

        {/* Profile.jsx Style Search Input */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full sm:max-w-md relative flex items-center"
        >
          <input
            type="text"
            value={heroSearch}
            onChange={(e) => setHeroSearch(e.target.value)}
            placeholder="Try 'Doro Wot', 'Tibs', 'Pizza'..."
            className={`w-full pl-4 pr-20 py-2.5 text-xs rounded-xl shadow-xs ${inputClasses}`}
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1.5 bg-[#2f5d4a] hover:bg-[#1e4033] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Find
          </button>
        </form>
      </div>

      {/* Profile.jsx Style Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={`${isDarkMode ? 'bg-[#182b25] border-[#2d413b]' : 'bg-[#fffaf4] border-[#e8dcc5]'} p-3.5 rounded-xl border shadow-[0_10px_20px_rgba(24,35,30,0.05)] text-center hover:border-[#f0b84d] transition group cursor-pointer`}>
          <strong className={`block text-xl font-black ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#1f2f27]'} group-hover:text-[#2f5d4a]`}>
            50+
          </strong>
          <small className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#c9d9d0]' : 'text-[#5d6f67]'}`}>
            Dishes
          </small>
        </div>
        <div className={`${isDarkMode ? 'bg-[#182b25] border-[#2d413b]' : 'bg-[#fffaf4] border-[#e8dcc5]'} p-3.5 rounded-xl border shadow-[0_10px_20px_rgba(24,35,30,0.05)] text-center hover:border-[#f0b84d] transition group cursor-pointer`}>
          <strong className={`block text-xl font-black ${isDarkMode ? 'text-[#f4c867]' : 'text-[#d56a2b]'}`}>
            4.9★
          </strong>
          <small className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#c9d9d0]' : 'text-[#5d6f67]'}`}>
            Rating
          </small>
        </div>
        <div className={`${isDarkMode ? 'bg-[#182b25] border-[#2d413b]' : 'bg-[#fffaf4] border-[#e8dcc5]'} p-3.5 rounded-xl border shadow-[0_10px_20px_rgba(24,35,30,0.05)] text-center hover:border-[#f0b84d] transition group cursor-pointer`}>
          <strong className={`block text-xl font-black ${isDarkMode ? 'text-[#f4c867]' : 'text-[#e0a632]'}`}>
            30m
          </strong>
          <small className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#c9d9d0]' : 'text-[#5d6f67]'}`}>
            Delivery
          </small>
        </div>
      </div>

      {/* Main Hero Banner with Profile.jsx styling */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#182b25] via-[#2f5d4a] to-[#111b18] text-white p-6 sm:p-10 lg:p-12 shadow-md">
        {/* Background ambient decoration */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#f4c867]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#d56a2b]/15 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-4">
            {/* Profile.jsx Style Promo Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#f4c867] font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-[#f4c867] animate-pulse" />
              <span>🔥 Special 20% OFF Weekend Feast • Code: ABRON20</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Authentic Ethiopian Flavors{" "}
              <span className="text-[#f4c867]">Delivered Hot</span> to Your Door
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
              From aromatic slow-cooked Doro Wot with hard-boiled eggs to
              sizzling Shekla Tibs and vegetarian Shiro, experience Addis
              Ababa's favorite kitchens in 30–45 minutes.
            </p>

            {/* Profile.jsx Style Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-[#f4c867] font-bold text-xs sm:text-sm">
                  <FiStar className="fill-current text-xs" /> 4.9
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Top Rated</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-[#f4c867] font-bold text-xs sm:text-sm">
                  <FiZap className="text-xs" /> 30–45m
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Fast Delivery
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-white font-bold text-xs sm:text-sm">
                  <GiMeal className="text-xs text-[#f4c867]" /> 100%
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Traditional</p>
              </div>
            </div>

            {/* Profile.jsx Style Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#menu-section"
                className="px-6 py-3 rounded-xl bg-[#2f5d4a] hover:bg-[#1e4033] text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-green-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Order Now</span>
                <FiArrowRight />
              </a>
              <Link
                to="/menu"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition border border-white/20"
              >
                Explore Full Menu
              </Link>
            </div>
          </div>

          {/* Right Hero Image Card with Profile.jsx styling */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-4/3 sm:aspect-square">
                <img
                  src="/images/Doro.jpg"
                  alt="Authentic Doro Wot"
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Profile.jsx Style Floating Dish Tag */}
                <div className={`absolute bottom-4 left-4 right-4 ${isDarkMode ? 'bg-[#182b25]/95 border-[#2b3f37]' : 'bg-[#fffaf4]/95 border-[#eadfc8]'} backdrop-blur-md rounded-xl p-3 shadow-lg border flex items-center justify-between`}>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-extrabold ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#1f2f27]'}`}>
                        Doro Wot Special
                      </span>
                      <span className="flex items-center text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                        <GiChiliPepper /> Spicy
                      </span>
                    </div>
                    <p className={`text-[10px] ${isDarkMode ? 'text-[#dfe9df]' : 'text-[#5d6f67]'} mt-0.5`}>
                      Traditional stew with hard-boiled egg
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-extrabold ${isDarkMode ? 'text-[#f4c867]' : 'text-[#2f5d4a]'} block`}>
                      ETB 380
                    </span>
                    <a
                      href="#menu-section"
                      className={`text-[10px] ${isDarkMode ? 'text-[#f4c867]' : 'text-[#2f5d4a]'} font-bold hover:underline`}
                    >
                      View +
                    </a>
                  </div>
                </div>
              </div>

              {/* Profile.jsx Style Chef Badge */}
              <div className="absolute -top-3 -right-2 sm:-right-4 bg-[#0d2e1a]/95 backdrop-blur-md border border-white/20 text-white rounded-xl py-2 px-3 shadow-xl flex items-center gap-2 z-20">
                <div className="w-7 h-7 rounded-full bg-[#f4c867]/20 text-[#f4c867] flex items-center justify-center font-bold text-xs">
                  ★
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white leading-tight">
                    Chef&rsquo;s Special
                  </p>
                  <p className="text-[9px] text-[#f4c867]">
                    Most Ordered Today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


}

export default Hero;
