import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create the Auth Context
const AuthContext = createContext(null);

const simulateApiDelay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user database (in real app, this would be server-side)
const getUsersFromStorage = () => {
  try {
    const users = localStorage.getItem('abron_users');
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem('abron_users', JSON.stringify(users));
  } catch (error) {
    console.warn('Failed to save users to storage:', error);
  }
};

// 2. Create the Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // Check local storage for an active session on app load
    const token = localStorage.getItem("abron_token");
    const savedUser = localStorage.getItem("abron_user");

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Verify token is still valid (simple check)
        if (userData && userData.id) {
          setUser(userData);
        } else {
          // Clear invalid session
          localStorage.removeItem("abron_token");
          localStorage.removeItem("abron_user");
        }
      } catch (err) {
        console.error("Failed to parse user session", err);
        localStorage.removeItem("abron_token");
        localStorage.removeItem("abron_user");
      }
    }
    setLoading(false);
    const syncSession = (event) => {
      if (event.key === "abron_user" || event.key === "abron_token") {
        const saved = localStorage.getItem("abron_user");
        try { setUser(saved ? JSON.parse(saved) : null); } catch { setUser(null); }
      }
    };
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, []);

  // Login function with email/password
  const login = async (email, password) => {
    setAuthLoading(true);
    
    try {
      await simulateApiDelay(800);
      
      // Get users from storage
      const users = getUsersFromStorage();
      const foundUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Generate simple token
      const token = `token_${foundUser.id}_${Date.now()}`;
      
      // Remove password from user data for security
      const { password: _, ...userDataWithoutPassword } = foundUser;
      
      // Save session
      localStorage.setItem("abron_token", token);
      localStorage.setItem("abron_user", JSON.stringify(userDataWithoutPassword));
      
      setUser(userDataWithoutPassword);
      return userDataWithoutPassword;
      
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    setAuthLoading(true);
    
    try {
      await simulateApiDelay(1000);
      
      const { email, password, name, phone, area = "", address = "" } = userData;
      
      // Get existing users
      const users = getUsersFromStorage();
      
      // Check if user already exists
      const existingUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email.toLowerCase(),
        password, // In real app, this would be hashed
        name,
        phone,
        area,
        address,
        role: "customer",
        createdAt: new Date().toISOString(),
        preferences: {
          newsletter: true,
          notifications: true
        }
      };
      
      // Save to storage
      users.push(newUser);
      saveUsersToStorage(users);
      
      // Generate token
      const token = `token_${newUser.id}_${Date.now()}`;
      
      // Remove password from user data
      const { password: _, ...userDataWithoutPassword } = newUser;
      
      // Save session
      localStorage.setItem("abron_token", token);
      localStorage.setItem("abron_user", JSON.stringify(userDataWithoutPassword));
      
      setUser(userDataWithoutPassword);
      return userDataWithoutPassword;
      
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Legacy login function for backward compatibility
  const loginWithUserData = (userData, token) => {
    localStorage.setItem("abron_token", token || `token_${Date.now()}`);
    localStorage.setItem("abron_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("abron_token");
    localStorage.removeItem("abron_user");
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (updates) => {
    if (!user) throw new Error('No user logged in');
    
    setAuthLoading(true);
    
    try {
      await simulateApiDelay(500);
      
      const users = getUsersFromStorage();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      // Update user data
      const updatedUser = {
        ...(users[userIndex] || user),
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      if (userIndex < 0) users.push(updatedUser);
      else users[userIndex] = updatedUser;
      saveUsersToStorage(users);
      
      // Remove password from updated user data
      const { password: _, ...userDataWithoutPassword } = updatedUser;
      
      // Update session
      localStorage.setItem("abron_user", JSON.stringify(userDataWithoutPassword));
      setUser(userDataWithoutPassword);
      
      return userDataWithoutPassword;
      
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const contextValue = {
    user,
    loading,
    authLoading,
    loginWithCredentials: login,
    register: signup,
    signup,
    logout,
    updateProfile,
    // Legacy support
    login: login,
    loginWithUserData,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. Custom Hook to easily use auth anywhere in your app
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
