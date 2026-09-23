import { useState, useEffect } from "react";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === "admin@abron.com" && password === "admin123") {
      localStorage.setItem("admin_token", "mock_admin_jwt_token");
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setIsAdmin(false);
  };

  return { isAdmin, loading, login, logout };
}
