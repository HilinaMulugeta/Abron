import { useState, useEffect, useCallback, useRef } from 'react';
import { menuApi } from '../api';

export const useMenu = (options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const abortControllerRef = useRef(null);
  
  const fetchMenuItems = useCallback(async (fetchOptions = {}) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await menuApi.getMenuItems({
        ...options,
        ...fetchOptions
      });
      
      setData(response.items);
      setPagination(response.pagination);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch menu items');
        console.error('Menu fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [options]);
  
  useEffect(() => {
    fetchMenuItems();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchMenuItems]);
  
  const refetch = useCallback((newOptions = {}) => {
    return fetchMenuItems(newOptions);
  }, [fetchMenuItems]);
  
  return {
    data,
    loading,
    error,
    pagination,
    refetch
  };
};

export const useMenuItem = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isCancelled = false;
    
    const fetchMenuItem = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const item = await menuApi.getMenuItem(id);
        
        if (!isCancelled) {
          setData(item);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Failed to fetch menu item');
          console.error('Menu item fetch error:', err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchMenuItem();
    
    return () => {
      isCancelled = true;
    };
  }, [id]);
  
  return { data, loading, error };
};

export const useMenuCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isCancelled = false;
    
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await menuApi.getCategories();
        
        if (!isCancelled) {
          setCategories(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Failed to fetch categories');
          console.error('Categories fetch error:', err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchCategories();
    
    return () => {
      isCancelled = true;
    };
  }, []);
  
  return { categories, loading, error };
};

export const useMenuSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  
  const search = useCallback(async (searchQuery, options = {}) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    if (!searchQuery.trim()) {
      setResults([]);
      setPagination(null);
      return;
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await menuApi.searchMenuItems(searchQuery, options);
      
      setResults(response.items);
      setPagination(response.pagination);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Search failed');
        console.error('Search error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  
  const debouncedSearch = useCallback((searchQuery, options = {}) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      search(searchQuery, options);
    }, 300); // 300ms debounce
  }, [search]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  return {
    query,
    setQuery,
    results,
    loading,
    error,
    pagination,
    search,
    debouncedSearch
  };
};