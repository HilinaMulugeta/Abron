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
    const syncAdmin = (event) => {
      if (event.key === "admin_token") setIsAdmin(Boolean(event.newValue));
    };
    window.addEventListener("storage", syncAdmin);
    return () => window.removeEventListener("storage", syncAdmin);
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
