import React from 'react';
import { ShopContext } from './ShopContext';

/**
 * Higher-order component that provides safe access to ShopContext
 * Prevents destructuring errors when context is not available
 */
export const withShopContext = (Component) => {
  const WrappedComponent = React.forwardRef((props, ref) => {
    const context = React.useContext(ShopContext);
    
    // If context is not available, provide default values
    if (!context) {
      const defaultContext = {
        products: [],
        cart: [],
        orders: [],
        favorites: [],
        promo: null,
        quantity: 0,
        subtotal: 0,
        deliveryFee: 0,
        discount: 0,
        total: 0,
        selectedArea: 'Bole',
        setSelectedArea: () => {},
        getDeliveryFeeForArea: () => 80,
        AREA_DELIVERY_FEES: {},
        adminStats: {
          totalRevenue: 0,
          formattedRevenue: 'ETB 0',
          totalOrders: 0,
          avgOrderValue: 0,
          formattedAvgOrderValue: 'ETB 0'
        },
        isDishAvailable: () => false,
        addToCart: () => false,
        removeFromCart: () => {},
        increaseQuantity: () => {},
        decreaseQuantity: () => {},
        clearCart: () => {},
        applyPromoCode: () => false,
        removePromoCode: () => {},
        toggleFavorite: () => {},
        isFavorite: () => false,
        addDish: () => {},
        updateDish: () => {},
        deleteDish: () => {},
        toggleDishAvailability: () => {},
        addOrder: () => {},
        updateOrderStatus: () => {},
        simulateNewOrder: () => {}
      };
      
      console.warn(`Component ${Component.displayName || Component.name} is using ShopContext but provider is not available. Using defaults.`);
      
      return <Component {...props} ref={ref} shopContext={defaultContext} />;
    }
    
    return <Component {...props} ref={ref} shopContext={context} />;
  });
  
  WrappedComponent.displayName = `withShopContext(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

/**
 * Hook that safely accesses ShopContext with default values
 */
export const useShopContext = () => {
  const context = React.useContext(ShopContext);
  
  if (!context) {
    console.warn('useShopContext called outside of ShopContextProvider');
    
    // Return default values to prevent app crashes
    return {
      products: [],
      cart: [],
      orders: [],
      favorites: [],
      promo: null,
      quantity: 0,
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      total: 0,
      selectedArea: 'Bole',
      setSelectedArea: () => {},
      getDeliveryFeeForArea: () => 80,
      AREA_DELIVERY_FEES: {},
      adminStats: {
        totalRevenue: 0,
        formattedRevenue: 'ETB 0',
        totalOrders: 0,
        avgOrderValue: 0,
        formattedAvgOrderValue: 'ETB 0'
      },
      isDishAvailable: () => false,
      addToCart: () => false,
      removeFromCart: () => {},
      increaseQuantity: () => {},
      decreaseQuantity: () => {},
      clearCart: () => {},
      applyPromoCode: () => false,
      removePromoCode: () => {},
      toggleFavorite: () => {},
      isFavorite: () => false,
      addDish: () => {},
      updateDish: () => {},
      deleteDish: () => {},
      toggleDishAvailability: () => {},
      addOrder: () => {},
      updateOrderStatus: () => {},
      simulateNewOrder: () => {}
    };
  }
  
  return context;
};

export default { withShopContext, useShopContext };