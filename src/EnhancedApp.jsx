import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import providers and contexts
import { AuthProvider } from "./auth/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

// Import existing components (not lazy loaded for now to avoid issues)
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./cart/Cart";
import Checkout from "./checkout/Checkout";
import OrderConfirmed from "./orders/OrderConfirmed";
import Profile from "./pages/Profile";
import OrderHistory from "./orders/OrderHistory";
import Search from "./pages/Search";
import FavoritesPage from "./favorites/FavoritesPage";
import NotFound from "./pages/NotFound";

// Admin components
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import RequireAdmin from "./admin/RequireAdmin";
import Dashboard from "./admin/Dashboard";
import DishManager from "./admin/DishManager";
import OrderManager from "./admin/OrderManager";
import AdminSettings from "./admin/AdminSettings";

// Enhanced components (lazy loaded)
const EnhancedHomePage = lazy(() => import("./pages/EnhancedHomePage"));
const EnhancedSearch = lazy(() => import("./pages/EnhancedSearch"));
const EnhancedCheckout = lazy(() => import("./checkout/EnhancedCheckout"));
const EnhancedDashboard = lazy(() => import("./admin/EnhancedDashboard"));

// Loading component for Suspense fallback
const LoadingFallback = ({ message = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  </div>
);

const EnhancedApp = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="text-sm"
          bodyClassName="text-sm"
        />
        
        {/* Main application with authentication context */}
        <AuthProvider>
          <Routes>
            {/* Customer Application Routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* Enhanced Home Page (optional route to test enhanced version) */}
            <Route 
              path="/enhanced" 
              element={
                <Suspense fallback={<LoadingFallback message="Loading Enhanced Home..." />}>
                  <EnhancedHomePage />
                </Suspense>
              } 
            />
            
            <Route path="/menu" element={<Search />} />
            
            {/* Enhanced Search (optional route) */}
            <Route 
              path="/enhanced-search" 
              element={
                <Suspense fallback={<LoadingFallback message="Loading Enhanced Search..." />}>
                  <EnhancedSearch />
                </Suspense>
              } 
            />
            
            <Route path="/menu/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* Use original checkout by default, enhanced available on separate route */}
            <Route path="/checkout" element={<Checkout />} />
            <Route 
              path="/enhanced-checkout" 
              element={
                <Suspense fallback={<LoadingFallback message="Loading Enhanced Checkout..." />}>
                  <EnhancedCheckout />
                </Suspense>
              } 
            />
            
            <Route path="/order-confirmed" element={<OrderConfirmed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/search" element={<Search />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* Admin Authentication Route */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                
                {/* Use original dashboard by default */}
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Enhanced dashboard on separate route */}
                <Route 
                  path="enhanced-dashboard" 
                  element={
                    <Suspense fallback={<LoadingFallback message="Loading Enhanced Dashboard..." />}>
                      <EnhancedDashboard />
                    </Suspense>
                  } 
                />
                
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
    </ErrorBoundary>
  );
};

export default EnhancedApp;