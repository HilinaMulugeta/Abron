import React from "react";
import { FaFacebook, FaTelegramPlane } from "react-icons/fa";
import { BsInstagram, BsTwitterX } from "react-icons/bs";
import { FiPhone, FiMapPin, FiClock, FiShield } from "react-icons/fi";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer bg-[#111b18] text-[#edf5ee] pt-12 pb-24 md:pb-12 border-t border-[#2b3f37]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Brand & Mission */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-xl bg-[linear-gradient(135deg,#f3b63b_0%,#d56a2b_52%,#2f5d4a_100%)] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm">
                <img src="favicon.ico" alt="abron" className="w-9 h-10" />
              </span>
              <span className="text-xl font-bold text-white tracking-wide">
                Abron
              </span>
            </div>
            <p className="text-xs text-[#dfe9df] leading-relaxed max-w-sm">
              Authentic Ethiopian tastes, savory stews, and modern comforts
              delivered hot &amp; fresh to your home across Addis Ababa.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#2f5d4a] border border-white/10 hover:border-[#f4c867] transition-all duration-200 flex items-center justify-center text-white hover:scale-105 active:scale-95 shadow-xs"
              >
                <FaFacebook className="text-sm w-[2em] h-[2em]" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#2f5d4a] border border-white/10 hover:border-[#f4c867] transition-all duration-200 flex items-center justify-center text-white hover:scale-105 active:scale-95 shadow-xs"
              >
                <BsInstagram className="text-sm w-[2em] h-[2em]" />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#2f5d4a] border border-white/10 hover:border-[#f4c867] transition-all duration-200 flex items-center justify-center text-white hover:scale-105 active:scale-95 shadow-xs"
              >
                <FaTelegramPlane className="text-sm w-[2em] h-[2em]" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#2f5d4a] border border-white/10 hover:border-[#f4c867] transition-all duration-200 flex items-center justify-center text-white hover:scale-105 active:scale-95 shadow-xs"
              >
                <BsTwitterX className="text-sm w-[2em] h-[2em]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f4c867] mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-[#dfe9df]">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home & Specials
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition">
                  Full Menu & Search
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition">
                  My Profile & Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f4c867] mb-3">
              Restaurant Hours
            </h4>
            <ul className="space-y-2.5 text-xs text-[#dfe9df]">
              <li className="flex items-start gap-2">
                <FiClock className="text-[#f4c867] mt-0.5 shrink-0" />
                <span>Monday – Sunday: 7:00 AM – 11:00 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin className="text-[#f4c867] mt-0.5 shrink-0" />
                <span>Gerji, Addis Ababa</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-[#f4c867] shrink-0" />
                <span>+251 91 839 3548</span>
              </li>
            </ul>
          </div>

          {/* Admin Switcher */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f4c867] mb-3">
              Staff & Operations
            </h4>
            <p className="text-xs text-[#dfe9df] mb-3">
              Ethiopian restaurant operations, live orders tracker, and menu
              inventory control.
            </p>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#2f5d4a] hover:bg-[#1e4033] text-white text-xs font-semibold transition shadow-sm border border-[#f4c867]/30"
            >
              <FiShield className="text-sm" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9aa8a1]">
          <p>© {new Date().getFullYear()} Hilina M | All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-[#9aa8a1]">Fast Delivery: 30–45 Mins</span>
            <span>•</span>
            <span className="text-[#f4c867] font-medium">100% Fresh </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
