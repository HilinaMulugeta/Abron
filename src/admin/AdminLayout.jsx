import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";
import {
  FiGrid,
  FiCoffee,
  FiShoppingBag,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
} from "react-icons/fi";
import ThemeToggle from "../theme/ThemeToggle";
import "./admin.css";

export default function AdminLayout() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState(() =>
    JSON.parse(
      localStorage.getItem("admin_profile") ||
        '{"name":"Yazachew(Manager)","initials":"YZ","role":"Admin account","email":"admin@abron.com"}',
    ),
  );

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const updateProfile = (nextProfile) => {
    setProfile(nextProfile);
    localStorage.setItem("admin_profile", JSON.stringify(nextProfile));
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiGrid /> },
    { name: "Dishes", path: "/admin/dishes", icon: <FiCoffee /> },
    { name: "Orders", path: "/admin/orders", icon: <FiShoppingBag /> },
    { name: "Settings", path: "/admin/settings", icon: <FiSettings /> },
  ];

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMenuOpen ? "is-open" : ""}`}>
        <div>
          <div className="admin-brand">
            <span className="admin-brand-mark">
              <img src="../favicon.ico" alt="abron" className="w-12 h-8" />
            </span>
            <span>Abron</span>
            <span className="admin-badge">Admin</span>
          </div>
          <nav className="admin-nav">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`admin-nav-link ${isActive ? "is-active" : ""}`}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout">
            <FiLogOut /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="admin-content">
        <header className="admin-header">
          <button
            className="admin-menu-button"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
          <div className="admin-header-copy">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#1f2f27] dark:text-[#f5f0e8]">
              Dashboard Overview
            </h1>
            <p className="text-xs text-[#5d6f67] dark:text-[#dfe9df] font-medium">
              Ethiopian restaurant management dashboard
            </p>
          </div>
          <div className="admin-header-actions">
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-[#2f5d4a] dark:text-[#f4c867] bg-[#edf5ee] dark:bg-[#20352e] hover:bg-[#f4efe9] dark:hover:bg-[#1e332e] px-3 py-1.5 rounded-lg border border-[#e8dcc5] dark:border-[#2d413b] transition"
              title="Go to customer website"
            >
              ← Customer Website
            </Link>
            <ThemeToggle />
            <button className="admin-icon-button" aria-label="Notifications">
              <FiBell />
              <span className="admin-notification-dot" />
            </button>
            <div className="admin-manager">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[linear-gradient(135deg,#f3b63b_0%,#d56a2b_52%,#2f5d4a_100%)] border border-[#eadfc8] dark:border-[#2b3f37] flex items-center justify-center text-xs font-bold text-white">
                {profile.initials || "MA"}
              </div>
              <span className="hidden sm:inline">
                <strong className="text-xs font-bold text-[#1f2f27] dark:text-[#f5f0e8]">
                  Yazachew (Manager Account)
                </strong>
                <small className="text-[10px] text-[#5d6f67] dark:text-[#dfe9df] block">
                  {"admin@abron.com"}
                </small>
              </span>
            </div>
          </div>
        </header>
        <main className="admin-main">
          <Outlet context={{ profile, updateProfile }} />
        </main>
      </div>
    </div>
  );
}
