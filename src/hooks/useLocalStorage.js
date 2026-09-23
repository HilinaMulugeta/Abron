import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (valueToStore === undefined || valueToStore === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue];
};

export const useCart = () => {
  const [cartItems, setCartItems] = useLocalStorage('abron_cart', []);
  
  const addToCart = (item, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // New item, add to cart
        return [...prevItems, { ...item, quantity }];
      }
    });
  };
  
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };
  
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  
  const isInCart = (itemId) => {
    return cartItems.some(item => item.id === itemId);
  };
  
  const getCartItem = (itemId) => {
    return cartItems.find(item => item.id === itemId);
  };
  
  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getCartItem
  };
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage('abron_favorites', []);
  
  const addToFavorites = (item) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.some(fav => fav.id === item.id)) {
        return prevFavorites; // Already in favorites
      }
      return [...prevFavorites, item];
    });
  };
  
  const removeFromFavorites = (itemId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(item => item.id !== itemId)
    );
  };
  
  const toggleFavorite = (item) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(fav => fav.id === item.id);
      
      if (isAlreadyFavorite) {
        return prevFavorites.filter(fav => fav.id !== item.id);
      } else {
        return [...prevFavorites, item];
      }
    });
  };
  
  const isFavorite = (itemId) => {
    return favorites.some(item => item.id === itemId);
  };
  
  const clearFavorites = () => {
    setFavorites([]);
  };
  
  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };
};