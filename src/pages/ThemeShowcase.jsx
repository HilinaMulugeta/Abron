import React, { useState } from 'react';
import { FiSun, FiMoon, FiCheck, FiX, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useTheme } from '../theme/ThemeContext';
import {
  ThemedButton,
  ThemedCard,
  ThemedInput,
  ThemedModal,
  ThemedLayout,
  ThemeToggle
} from '../theme';
import { toast } from 'react-toastify';

const ThemeShowcase = () => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleToast = (type) => {
    const messages = {
      success: 'Theme system working perfectly! 🎉',
      error: 'This is an error message example',
      info: 'Profile.jsx colors applied successfully',
      warning: 'Theme switching is smooth and seamless'
    };

    toast[type](messages[type]);
  };

  return (
    <ThemedLayout containerClass="py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className={`text-4xl font-black ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#1f2f27]'}`}>
          Abron Theme System
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-[#dfe9df]' : 'text-[#5d6f67]'}`}>
          Consistent theming across the entire application based on Profile.jsx colors
        </p>
        
        {/* Theme Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm ${isDarkMode ? 'text-[#dce8e0]' : 'text-[#728077]'}`}>
            Current theme: {isDarkMode ? 'Dark' : 'Light'}
          </span>
          <ThemeToggle size="lg" />
        </div>
      </div>

      {/* Color Palette Display */}
      <ThemedCard className="p-6">
        <h2 className={`text-2xl font-black mb-6 ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#24382f]'}`}>
          Color Palette
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Brand Colors */}
          <div className="space-y-2">
            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-[#f4c867]' : 'text-[#2f5d4a]'}`}>
              Brand
            </h3>
            <div className="w-16 h-16 rounded-lg bg-[linear-gradient(135deg,#f3b63b_0%,#d56a2b_52%,#2f5d4a_100%)] shadow-lg"></div>
            <p className={`text-xs ${isDarkMode ? 'text-[#dce8e0]' : 'text-[#728077]'}`}>
              Primary Gradient
            </p>
          </div>
          
          {/* Background Colors */}
          <div className="space-y-2">
            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-[#f4c867]' : 'text-[#2f5d4a]'}`}>
              Background
            </h3>
            <div className={`w-16 h-16 rounded-lg border-2 ${isDarkMode ? 'bg-[#182b25] border-[#2d413b]' : 'bg-[#fffaf4] border-[#e8dcc5]'}`}></div>
            <p className={`text-xs ${isDarkMode ? 'text-[#dce8e0]' : 'text-[#728077]'}`}>
              Card Background
            </p>
          </div>
          
          {/* Text Colors */}
          <div className="space-y-2">
            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-[#f4c867]' : 'text-[#2f5d4a]'}`}>
              Text
            </h3>
            <div className={`w-16 h-16 rounded-lg ${isDarkMode ? 'bg-[#edf5ee]' : 'bg-[#1f2e28]'}`}></div>
            <p className={`text-xs ${isDarkMode ? 'text-[#dce8e0]' : 'text-[#728077]'}`}>
              Primary Text
            </p>
          </div>
          
          {/* Accent Colors */}
          <div className="space-y-2">
            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-[#f4c867]' : 'text-[#2f5d4a]'}`}>
              Accent
            </h3>
            <div className={`w-16 h-16 rounded-lg ${isDarkMode ? 'bg-[#f4c867]' : 'bg-[#2f5d4a]'}`}></div>
            <p className={`text-xs ${isDarkMode ? 'text-[#dce8e0]' : 'text-[#728077]'}`}>
              Links & Highlights
            </p>
          </div>
        </div>
      </ThemedCard>

      {/* Button Variants */}
      <ThemedCard className="p-6">
        <h2 className={`text-2xl font-black mb-6 ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#24382f]'}`}>
          Button Variants
        </h2>
        
        <div className="flex flex-wrap gap-4">
          <ThemedButton variant="primary" size="sm">
            Primary Small
          </ThemedButton>
          <ThemedButton variant="primary" size="md">
            Primary Medium
          </ThemedButton>
          <ThemedButton variant="primary" size="lg">
            Primary Large
          </ThemedButton>
          <ThemedButton variant="secondary" size="md">
            Secondary
          </ThemedButton>
          <ThemedButton variant="ghost" size="md">
            Ghost Button
          </ThemedButton>
        </div>
      </ThemedCard>

      {/* Form Elements */}
      <ThemedCard className="p-6">
        <h2 className={`text-2xl font-black mb-6 ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#24382f]'}`}>
          Form Elements
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <ThemedInput
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <ThemedInput
            label="Password"
            type="password"
            placeholder="Enter password"
          />
          <ThemedInput
            label="With Error"
            type="text"
            placeholder="This field has an error"
            error="This field is required"
          />
          <ThemedInput
            label="Phone Number"
            type="tel"
            placeholder="+251 911 234 567"
          />
        </div>
      </ThemedCard>

      {/* Interactive Elements */}
      <ThemedCard className="p-6">
        <h2 className={`text-2xl font-black mb-6 ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#24382f]'}`}>
          Interactive Elements
        </h2>
        
        <div className="space-y-4">
          {/* Toggle Switch Demo */}
          <div className="flex items-center justify-between p-4 rounded-xl border" 
               style={{
                 backgroundColor: isDarkMode ? '#1e332e' : '#f4efe9',
                 borderColor: isDarkMode ? '#2d413b' : '#f0e6d8'
               }}>
            <span className={`font-medium ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#24382f]'}`}>
              Enable notifications
            </span>
            <button
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer bg-[#2f5d4a]`}
            >
              <span className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full transition-transform" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <ThemedButton 
              variant="primary" 
              onClick={() => handleToast('success')}
              className="flex items-center gap-2"
            >
              <FiCheck /> Success Toast
            </ThemedButton>
            <ThemedButton 
              variant="secondary" 
              onClick={() => handleToast('error')}
              className="flex items-center gap-2"
            >
              <FiX /> Error Toast
            </ThemedButton>
            <ThemedButton 
              variant="ghost" 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2"
            >
              <FiUser /> Show Modal
            </ThemedButton>
          </div>
        </div>
      </ThemedCard>

      {/* Navigation Preview */}
      <ThemedCard className="p-6">
        <h2 className={`text-2xl font-black mb-6 ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#24382f]'}`}>
          Navigation Elements
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {[
            { icon: FiUser, label: 'Profile', active: true },
            { icon: FiHeart, label: 'Favorites', active: false },
            { icon: FiShoppingCart, label: 'Cart', active: false }
          ].map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                active
                  ? isDarkMode 
                    ? 'bg-[#213b34] text-[#f4c867]'
                    : 'bg-[#eef5ef] text-[#2f5d4a]'
                  : isDarkMode
                    ? 'text-[#d9e5df] hover:bg-[#1b2d29] hover:text-[#f4c867]'
                    : 'text-[#586760] hover:bg-[#f7efe6] hover:text-[#d77a2f]'
              }`}
            >
              <Icon className="text-sm" />
              {label}
            </button>
          ))}
        </div>
      </ThemedCard>

      {/* Theme Statistics */}
      <ThemedCard className="p-6">
        <h2 className={`text-2xl font-black mb-6 ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#24382f]'}`}>
          Theme Implementation Status
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl" 
               style={{
                 backgroundColor: isDarkMode ? '#20352e' : '#edf5ee'
               }}>
            <div className={`text-2xl font-black ${isDarkMode ? 'text-[#f4c867]' : 'text-[#2f5d4a]'}`}>
              15+
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-[#dce8e0]' : 'text-[#728077]'}`}>
              Components Themed
            </div>
          </div>
          <div className="text-center p-4 rounded-xl" 
               style={{
                 backgroundColor: isDarkMode ? '#20352e' : '#edf5ee'
               }}>
            <div className={`text-2xl font-black ${isDarkMode ? 'text-[#f4c867]' : 'text-[#2f5d4a]'}`}>
              100%
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-[#dce8e0]' : 'text-[#728077]'}`}>
              Profile.jsx Compatible
            </div>
          </div>
          <div className="text-center p-4 rounded-xl" 
               style={{
                 backgroundColor: isDarkMode ? '#20352e' : '#edf5ee'
               }}>
            <div className={`text-2xl font-black ${isDarkMode ? 'text-[#f4c867]' : 'text-[#2f5d4a]'}`}>
              2
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-[#dce8e0]' : 'text-[#728077]'}`}>
              Theme Modes
            </div>
          </div>
        </div>
      </ThemedCard>

      {/* Modal Demo */}
      <ThemedModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Theme Demo Modal"
      >
        <div className="space-y-4">
          <p className={isDarkMode ? 'text-[#dfe9df]' : 'text-[#5d6f67]'}>
            This modal demonstrates the theme system in action. Notice how all colors, 
            typography, and spacing follow the Profile.jsx design language.
          </p>
          
          <div className="flex gap-3">
            <ThemedButton variant="primary" onClick={() => setShowModal(false)}>
              Confirm
            </ThemedButton>
            <ThemedButton variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </ThemedButton>
          </div>
        </div>
      </ThemedModal>
    </ThemedLayout>
  );
};

export default ThemeShowcase;