import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./cart/Cart";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./theme/ThemeContext";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import RequireAdmin from "./admin/RequireAdmin";
import Dashboard from "./admin/Dashboard";
import DishManager from "./admin/DishManager";
import OrderManager from "./admin/OrderManager";
import AdminSettings from "./admin/AdminSettings";
import Checkout from "./checkout/Checkout";
import OrderConfirmed from "./orders/OrderConfirmed";
import Profile from "./pages/Profile";
import OrderHistory from "./orders/OrderHistory";
import Search from "./pages/Search";
import FavoritesPage from "./favorites/FavoritesPage";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--abron-bg-primary)] text-[var(--abron-text-primary)] transition-colors duration-200">
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastClassName="!bg-[#fffaf4] dark:!bg-[#182b25] !text-[#1f2e28] dark:!text-[#edf5ee] !border !border-[#eadfc8] dark:!border-[#2b3f37]"
        />
        <AuthProvider>
        <Routes>
          {/* Customer Application Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<Search />} />
          <Route path="/menu/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmed" element={<OrderConfirmed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Admin Authentication & Dashboard Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="menu" element={<DishManager />} />
              <Route path="dishes" element={<DishManager />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </div>
  </ThemeProvider>
  );
};

export default App;
