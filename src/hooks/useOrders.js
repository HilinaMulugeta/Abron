import { useState, useEffect, useCallback, useRef } from 'react';
import { orderApi } from '../api';
import { useAuth } from '../auth/AuthContext';

export const useOrders = (options = {}) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const abortControllerRef = useRef(null);
  
  const fetchOrders = useCallback(async (fetchOptions = {}) => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderApi.getUserOrders(
        user.id,
        fetchOptions.page || options.page || 1,
        fetchOptions.limit || options.limit || 10
      );
      
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch orders');
        console.error('Orders fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id, options]);
  
  useEffect(() => {
    fetchOrders();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchOrders]);
  
  const refetch = useCallback((newOptions = {}) => {
    return fetchOrders(newOptions);
  }, [fetchOrders]);
  
  return {
    orders,
    loading,
    error,
    pagination,
    refetch
  };
};

export const useOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isCancelled = false;
    
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await orderApi.getOrder(orderId);
        
        if (!isCancelled) {
          setOrder(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Failed to fetch order');
          console.error('Order fetch error:', err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchOrder();
    
    return () => {
      isCancelled = true;
    };
  }, [orderId]);
  
  return { order, loading, error };
};

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const createOrder = useCallback(async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      
      const order = await orderApi.createOrder(orderData);
      return order;
    } catch (err) {
      setError(err.message || 'Failed to create order');
      console.error('Order creation error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { createOrder, loading, error };
};

// Admin hooks
export const useAdminOrders = (options = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const abortControllerRef = useRef(null);
  
  const fetchOrders = useCallback(async (fetchOptions = {}) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderApi.getAllOrders(
        fetchOptions.page || options.page || 1,
        fetchOptions.limit || options.limit || 20,
        fetchOptions.status || options.status || 'all'
      );
      
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch orders');
        console.error('Admin orders fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [options]);
  
  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      const updatedOrder = await orderApi.updateOrderStatus(orderId, status);
      
      // Update the order in the current list
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      
      return updatedOrder;
    } catch (err) {
      setError(err.message || 'Failed to update order status');
      console.error('Order status update error:', err);
      throw err;
    }
  }, []);
  
  useEffect(() => {
    fetchOrders();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchOrders]);
  
  const refetch = useCallback((newOptions = {}) => {
    return fetchOrders(newOptions);
  }, [fetchOrders]);
  
  return {
    orders,
    loading,
    error,
    pagination,
    updateOrderStatus,
    refetch
  };
};

export const useOrderStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await orderApi.getOrderStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch order statistics');
      console.error('Order stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  return { stats, loading, error, refetch: fetchStats };
};