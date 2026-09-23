import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiChevronLeft,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiCreditCard,
  FiDollarSign,
  FiSmartphone,
  FiX,
  FiUser,
  FiLock
} from "react-icons/fi";

import { useAuth } from "../auth/AuthContext";
import { useCart } from "../hooks/useLocalStorage";
import { useCreateOrder } from "../hooks/useOrders";
import LoginSignupModal from "../auth/LoginSignupModal";
import { Skeleton } from "../ui/SkeletonLoader";
import ErrorBoundary from "../components/ErrorBoundary";
import { announceToScreenReader } from "../utils/accessibility";

const EnhancedCheckout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    cartItems, 
    getCartTotal, 
    getCartItemsCount,
    clearCart 
  } = useCart();
  const { createOrder, loading: orderLoading, error: orderError } = useCreateOrder();
  
  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    deliveryArea: 'Bole',
    address: 'Bole Medhanialem, Addis Ababa',
    instructions: '',
    paymentMethod: 'Cash on Delivery'
  });
  
  // Payment method specific data
  const [paymentData, setPaymentData] = useState({
    telebirrPhone: '',
    cbeBirrAccount: '',
    cardNumber: '',
    cardHolder: '',
    cardExpiry: '',
    cardCvv: '',
    cashChangeOption: 'Exact change'
  });
  
  // UI state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Delivery areas with fees
  const deliveryAreas = {
    'Bole': { fee: 80, label: 'Bole (Medhanialem, Atlas)' },
    'Kazanchis': { fee: 100, label: 'Kazanchis (ECA, Intercontinental)' },
    'Sarbet': { fee: 110, label: 'Sarbet (Vatican, Old Airport)' },
    'Piassa': { fee: 120, label: 'Piassa (Churchill, Arat Kilo)' },
    'Gerji': { fee: 130, label: 'Gerji (Imperial, Jackros)' },
    'CMC': { fee: 150, label: 'CMC (Gurd Shola, Sunshine)' }
  };
  
  // Calculate totals
  const subtotal = getCartTotal();
  const deliveryFee = deliveryAreas[formData.deliveryArea]?.fee || 80;
  const total = subtotal + deliveryFee;
  
  // Check if user is authenticated on mount
  useEffect(() => {
    if (!isAuthenticated && cartItems.length > 0) {
      setShowAuthModal(true);
      announceToScreenReader('Please sign in to continue with checkout');
    }
  }, [isAuthenticated, cartItems.length]);
  
  // Populate user data when authenticated
  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        phoneNumber: user.phone || ''
      }));
    }
  }, [user, isAuthenticated]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
      toast.info('Your cart is empty');
    }
  }, [cartItems.length, navigate]);
  
  // Handle auth modal close
  const handleAuthModalClose = (redirectTo) => {
    setShowAuthModal(false);
    
    if (!isAuthenticated) {
      // If still not authenticated, redirect to cart
      navigate('/cart');
      toast.info('Please sign in to checkout');
    } else {
      announceToScreenReader('Successfully signed in. You can now complete your order.');
    }
  };
  
  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handlePaymentDataChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };
  
  // Validate form
  const validateForm = () => {
    if (!formData.fullName || formData.fullName.trim().length < 3) {
      toast.error("Please enter your full name (minimum 3 characters).");
      return false;
    }
    
    const cleanPhone = formData.phoneNumber.replace(/[\s\-()]/g, "");
    const ethiopianPhoneRegex = /^(\+251|0)?[79]\d{8}$/;
    if (!ethiopianPhoneRegex.test(cleanPhone)) {
      toast.error("Please enter a valid Ethiopian phone number.");
      return false;
    }
    
    if (!formData.address || formData.address.trim().length < 5) {
      toast.error("Please provide a valid delivery address.");
      return false;
    }
    
    return true;
  };
  
  // Handle order submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    announceToScreenReader('Processing your order');
    
    try {
      // Prepare order data
      const orderData = {
        userId: user.id,
        customer: formData.fullName.trim(),
        phone: formData.phoneNumber.trim(),
        email: user.email,
        address: formData.address.trim(),
        deliveryArea: formData.deliveryArea,
        instructions: formData.instructions,
        paymentMethod: formData.paymentMethod,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal,
        deliveryFee,
        total,
        orderDate: new Date().toISOString()
      };
      
      // Create order
      const order = await createOrder(orderData);
      
      // Clear cart
      clearCart();
      
      toast.success("Order placed successfully!");
      announceToScreenReader('Order placed successfully! Redirecting to confirmation page.');
      
      // Navigate to order confirmation
      navigate("/order-confirmed", { 
        state: { order },
        replace: true 
      });
      
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error(error.message || "Failed to place order. Please try again.");
      announceToScreenReader(`Order failed: ${error.message || 'Please try again'}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Popular addresses for quick selection
  const popularAddresses = [
    "Bole Medhanialem, Edna Mall area, Addis Ababa",
    "Kazanchis, Near ECA Building, Addis Ababa",
    "Sarbet, Near Vatican Embassy, Addis Ababa",
    "Piassa, Churchill Avenue, Addis Ababa",
    "CMC Michael, Sunshine Real Estate, Addis Ababa",
  ];
  
  // Show authentication required screen
  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <FiLock className="text-2xl text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sign In Required
            </h2>
            
            <p className="text-gray-600 mb-6">
              Please sign in to your account or create a new one to complete your order.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Sign In / Sign Up
              </button>
              
              <button
                onClick={() => navigate('/cart')}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
        
        <LoginSignupModal
          isOpen={showAuthModal}
          onClose={handleAuthModalClose}
          redirectTo="/checkout"
        />
      </ErrorBoundary>
    );
  }
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Go back to cart"
            >
              <FiChevronLeft className="text-xl" />
              <span className="font-medium">Back to Cart</span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600" aria-label="Current step: Checkout" />
              <div className="w-3 h-3 rounded-full bg-gray-200" aria-label="Next step: Confirmation" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Complete Your Order
              </h1>
              <p className="text-gray-600">
                Welcome back, {user?.name}! Review your order details below.
              </p>
            </div>
            
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiCheckCircle className="text-green-600" />
                  Order Summary ({getCartItemsCount()} items)
                </h3>
                
                <div className="space-y-2 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-gray-900">
                        ETB {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">ETB {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Delivery ({deliveryAreas[formData.deliveryArea]?.label})
                    </span>
                    <span className="text-gray-900">ETB {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-green-700 text-lg pt-1 border-t border-gray-200">
                    <span>Total</span>
                    <span>ETB {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Customer Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="+251 911 234 567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Delivery Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiMapPin className="text-green-600" />
                  Delivery Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="deliveryArea" className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Area
                    </label>
                    <select
                      id="deliveryArea"
                      value={formData.deliveryArea}
                      onChange={(e) => {
                        handleInputChange('deliveryArea', e.target.value);
                        handleInputChange('address', `${e.target.value}, Addis Ababa`);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {Object.entries(deliveryAreas).map(([key, area]) => (
                        <option key={key} value={key}>
                          {area.label} — ETB {area.fee}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="address"
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter your delivery address"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => setAddressModalOpen(true)}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                      >
                        Quick Select
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <FiClock className="text-green-600" />
                    <span className="text-sm text-green-800">
                      <strong>Estimated delivery:</strong> 30-45 minutes
                    </span>
                  </div>
                  
                  <div>
                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      id="instructions"
                      rows={3}
                      value={formData.instructions}
                      onChange={(e) => handleInputChange('instructions', e.target.value)}
                      placeholder="Any special delivery instructions..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiCreditCard className="text-green-600" />
                  Payment Method
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: 'Cash on Delivery', icon: FiDollarSign, label: 'Cash on Delivery', badge: 'Popular' },
                    { value: 'Telebirr', icon: FiSmartphone, label: 'Telebirr', badge: 'Instant' },
                    { value: 'CBE Birr', icon: FiCheckCircle, label: 'CBE Birr', badge: 'USSD' },
                    { value: 'Card Payment', icon: FiCreditCard, label: 'Card Payment', badge: 'Secure' },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = formData.paymentMethod === method.value;
                    
                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => handleInputChange('paymentMethod', method.value)}
                        className={`p-4 border rounded-lg transition-all text-left ${
                          isSelected
                            ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className={`text-lg ${isSelected ? 'text-green-600' : 'text-gray-400'}`} />
                            <span className={`font-medium ${isSelected ? 'text-green-900' : 'text-gray-700'}`}>
                              {method.label}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            isSelected 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {method.badge}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting || orderLoading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                    submitting || orderLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                  } text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                >
                  {submitting || orderLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Order...
                    </div>
                  ) : (
                    `Place Order • ETB ${total.toLocaleString()}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Address Selection Modal */}
        {addressModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Address Selection
                </h3>
                <button
                  onClick={() => setAddressModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Close address selection"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              
              <div className="space-y-2">
                {popularAddresses.map((address, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleInputChange('address', address);
                      setAddressModalOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors text-sm"
                  >
                    {address}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Auth Modal */}
        <LoginSignupModal
          isOpen={showAuthModal}
          onClose={handleAuthModalClose}
          redirectTo="/checkout"
        />
      </div>
    </ErrorBoundary>
  );
};

export default EnhancedCheckout;