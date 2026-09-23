import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";

export default function RequireAdmin() {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-green-400 font-medium">
        Loading Abron Admin...
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
