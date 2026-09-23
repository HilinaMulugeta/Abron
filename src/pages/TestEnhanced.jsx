import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, useFavorites } from '../hooks/useLocalStorage';
import { useMenu } from '../hooks/useMenu';
import { Skeleton, MenuGridSkeleton } from '../ui/SkeletonLoader';
import ErrorBoundary from '../components/ErrorBoundary';
import LazyImage from '../ui/LazyImage';
import MobileAppShell from '../components/MobileAppShell';

const TestEnhanced = () => {
  const [showCharts, setShowCharts] = useState(false);
  
  // Test custom hooks
  const { cartItems, addToCart, getCartTotal } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const { data: menuItems, loading, error } = useMenu({ limit: 6 });
  
  const testAddToCart = () => {
    addToCart({
      id: 'test-item',
      name: 'Test Dish',
      price: 250,
      image: '/images/Doro.jpg'
    }, 1);
  };
  
  const testToggleFavorite = () => {
    toggleFavorite({
      id: 'test-fav',
      name: 'Favorite Test Dish',
      price: 300,
      image: '/images/Tibs.jpg'
    });
  };
  
  return (
    <ErrorBoundary>
      <MobileAppShell>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              🧪 Enhanced Features Test Page
            </h1>
            <p className="text-gray-600 mb-6">
              This page demonstrates all the enhanced features that have been added to the app.
            </p>
            
            {/* Navigation Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Link 
                to="/enhanced"
                className="p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
              >
                <h3 className="font-semibold text-green-800">🏠 Enhanced Home Page</h3>
                <p className="text-sm text-green-600">Dynamic API-powered home page</p>
              </Link>
              
              <Link 
                to="/enhanced-search"
                className="p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <h3 className="font-semibold text-blue-800">🔍 Enhanced Search</h3>
                <p className="text-sm text-blue-600">Advanced search with filters</p>
              </Link>
              
              <Link 
                to="/enhanced-checkout"
                className="p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <h3 className="font-semibold text-purple-800">💳 Enhanced Checkout</h3>
                <p className="text-sm text-purple-600">Authentication-required checkout</p>
              </Link>
              
              <Link 
                to="/admin/enhanced-dashboard"
                className="p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors"
              >
                <h3 className="font-semibold text-orange-800">📊 Enhanced Dashboard</h3>
                <p className="text-sm text-orange-600">Charts and analytics (Admin only)</p>
              </Link>
            </div>
            
            {/* Feature Tests */}
            <div className="space-y-6">
              {/* Cart and Favorites Test */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3">🛒 Cart & Favorites Test</h3>
                <div className="flex gap-4 mb-3">
                  <button 
                    onClick={testAddToCart}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Add Test Item to Cart
                  </button>
                  <button 
                    onClick={testToggleFavorite}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Toggle Test Favorite
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Cart Items: {cartItems.length} | Cart Total: ETB {getCartTotal()} | 
                  Favorites: {favorites.length}
                </div>
              </div>
              
              {/* API Integration Test */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3">🌐 API Integration Test</h3>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton width="100%" height="1rem" />
                    <Skeleton width="80%" height="1rem" />
                    <Skeleton width="60%" height="1rem" />
                  </div>
                ) : error ? (
                  <div className="text-red-600 text-sm">Error: {error}</div>
                ) : (
                  <div className="text-sm text-gray-600">
                    Successfully loaded {menuItems?.length || 0} menu items from API
                  </div>
                )}
              </div>
              
              {/* Skeleton Loading Test */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3">⏳ Skeleton Loading Test</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Individual Skeletons:</h4>
                    <div className="space-y-2">
                      <Skeleton width="100%" height="1rem" />
                      <Skeleton width="75%" height="1rem" />
                      <Skeleton width="50%" height="1rem" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Lazy Image:</h4>
                    <LazyImage
                      src="/images/Doro.jpg"
                      alt="Test lazy image"
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Error Boundary Test */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3">🛡️ Error Boundary Test</h3>
                <p className="text-sm text-gray-600 mb-2">
                  This page is wrapped in an ErrorBoundary. Any errors will be caught gracefully.
                </p>
                <div className="text-xs text-gray-500">
                  ✅ ErrorBoundary is active and protecting this component tree
                </div>
              </div>
              
              {/* Console Utilities Test */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3">🖥️ Console Utilities Test</h3>
                <button 
                  onClick={() => {
                    console.log('✅ Console utilities are working');
                    alert('Check the browser console - enhanced logging is active!');
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Test Console Logging
                </button>
              </div>
            </div>
            
            {/* Back to Original App */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-semibold text-blue-800 mb-2">📱 Navigation</h3>
              <div className="flex gap-4">
                <Link 
                  to="/"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Back to Original Home
                </Link>
                <Link 
                  to="/menu"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Original Menu/Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </MobileAppShell>
    </ErrorBoundary>
  );
};

export default TestEnhanced;