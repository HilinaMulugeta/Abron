import { useState, useEffect } from "react";

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
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

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
  const [cartItems, setCartItems] = useLocalStorage("abron_cart", []);

  const getNormalizedQuantity = (item, fallback = 1) => {
    const value = Number(item?.quantity ?? item?.amount ?? fallback);
    return Number.isFinite(value) && value > 0 ? value : fallback;
  };

  const addToCart = (item, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => String(cartItem.id) === String(item.id),
      );
      const qtyToAdd = getNormalizedQuantity({ quantity }, 1);
      const normalizedQty = Number(quantity) > 0 ? Number(quantity) : qtyToAdd;

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const nextQty = getNormalizedQuantity(existingItem) + normalizedQty;
        updatedItems[existingItemIndex] = {
          ...existingItem,
          ...item,
          quantity: nextQty,
          amount: nextQty,
        };
        return updatedItems;
      }

      return [
        ...prevItems,
        { ...item, quantity: normalizedQty, amount: normalizedQty },
      ];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => String(item.id) !== String(itemId)),
    );
  };

  const updateQuantity = (itemId, quantity) => {
    const nextQty = Number(quantity) > 0 ? Number(quantity) : 0;
    if (nextQty <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        String(item.id) === String(itemId)
          ? { ...item, quantity: nextQty, amount: nextQty }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const qty = getNormalizedQuantity(item, 1);
      return total + price * qty;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce(
      (count, item) => count + getNormalizedQuantity(item, 1),
      0,
    );
  };

  const isInCart = (itemId) => {
    return cartItems.some((item) => item.id === itemId);
  };

  const getCartItem = (itemId) => {
    return cartItems.find((item) => item.id === itemId);
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
    getCartItem,
  };
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage("abron_favorites", []);

  const addToFavorites = (item) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === item.id)) {
        return prevFavorites; // Already in favorites
      }
      return [...prevFavorites, item];
    });
  };

  const removeFromFavorites = (itemId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((item) => item.id !== itemId),
    );
  };

  const toggleFavorite = (item) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some((fav) => fav.id === item.id);

      if (isAlreadyFavorite) {
        return prevFavorites.filter((fav) => fav.id !== item.id);
      } else {
        return [...prevFavorites, item];
      }
    });
  };

  const isFavorite = (itemId) => {
    return favorites.some((item) => item.id === itemId);
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
    clearFavorites,
  };
};
