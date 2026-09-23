import React, { useState } from 'react';
import { FiX, FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { useTheme } from '../theme/ThemeContext';
import { getThemeClass } from '../theme/components';
import ThemedButton from '../components/ui/ThemedButton';
import ThemedInput from '../components/ui/ThemedInput';
import ThemedCard from '../components/ui/ThemedCard';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const ThemedLoginSignupModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { isDarkMode } = useTheme();
  const { login, register } = useAuth();
  
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const pageClasses = getThemeClass('page', 'base', isDarkMode);
  const headingClasses = getThemeClass('heading', 'primary', isDarkMode);
  const textClasses = getThemeClass('text', 'primary', isDarkMode);
  const mutedClasses = getThemeClass('text', 'muted', isDarkMode);
  const accentClasses = getThemeClass('text', 'accent', isDarkMode);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        toast.success('Welcome back to Abron!');
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
        toast.success('Account created successfully! Welcome to Abron!');
      }
      onClose();
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setErrors({});
    setFormData({
      name: '',
      email: formData.email, // Keep email when switching
      phone: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <ThemedCard 
        className="w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg ${mutedClasses} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        >
          <FiX className="text-lg" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          {/* Logo */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[linear-gradient(135deg,#f3b63b_0%,#d56a2b_52%,#2f5d4a_100%)] text-white font-black text-2xl flex items-center justify-center shadow-[0_10px_18px_rgba(212,137,44,0.25)]">
            A
          </div>
          
          <h1 className={`text-xl mb-2 ${headingClasses}`}>
            {mode === 'login' ? 'Welcome Back' : 'Join Abron'}
          </h1>
          <p className={`text-sm ${mutedClasses}`}>
            {mode === 'login' 
              ? 'Sign in to your account to continue ordering' 
              : 'Create your account and start your Ethiopian food journey'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <ThemedInput
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="Enter your full name"
                required
              />
              
              <ThemedInput
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                placeholder="+251 911 234 567"
                required
              />
            </>
          )}
          
          <ThemedInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="your@email.com"
            required
          />
          
          <div className="relative">
            <ThemedInput
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-[2.1rem] ${mutedClasses} hover:${accentClasses} transition-colors`}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          
          {mode === 'signup' && (
            <ThemedInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              required
            />
          )}
          
          <ThemedButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading 
              ? (mode === 'login' ? 'Signing in...' : 'Creating account...') 
              : (mode === 'login' ? 'Sign In' : 'Create Account')
            }
          </ThemedButton>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-[#2d413b]' : 'bg-[#f0e6d8]'}`}></div>
          <span className={`px-3 text-xs ${mutedClasses}`}>or</span>
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-[#2d413b]' : 'bg-[#f0e6d8]'}`}></div>
        </div>

        {/* Switch Mode */}
        <div className="text-center">
          <p className={`text-sm ${mutedClasses}`}>
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            {' '}
            <button
              type="button"
              onClick={switchMode}
              className={`font-bold ${accentClasses} hover:underline transition-colors`}
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Terms for signup */}
        {mode === 'signup' && (
          <p className={`text-xs text-center mt-4 ${mutedClasses}`}>
            By creating an account, you agree to our{' '}
            <button className={`${accentClasses} hover:underline`}>
              Terms of Service
            </button>
            {' '}and{' '}
            <button className={`${accentClasses} hover:underline`}>
              Privacy Policy
            </button>
          </p>
        )}
      </ThemedCard>
    </div>
  );
};

export default ThemedLoginSignupModal;