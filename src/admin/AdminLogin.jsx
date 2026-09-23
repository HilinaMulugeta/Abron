import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";
import { FiLock, FiMail } from "react-icons/fi";
import ThemeToggle from "../theme/ThemeToggle";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Use admin@abron.com / admin123");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6efe7] dark:bg-[#111b18] text-[#1f2e28] dark:text-[#edf5ee] px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-2xl bg-[#fffaf4] dark:bg-[#182b25] p-8 shadow-[0_12px_28px_rgba(54,38,17,0.08)] border border-[#eadfc8] dark:border-[#2b3f37]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[linear-gradient(135deg,#f3b63b_0%,#d56a2b_52%,#2f5d4a_100%)] text-white font-black text-xl flex items-center justify-center shadow-[0_10px_18px_rgba(212,137,44,0.25)]">
            A
          </div>
          <h2 className="text-2xl font-black text-[#1f2f27] dark:text-[#f5f0e8]">
            Abron Admin
          </h2>
          <p className="text-xs text-[#5d6f67] dark:text-[#dfe9df] mt-1 font-medium">
            Sign in to manage your restaurant dashboard
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#24382f] dark:text-[#f5f0e8] mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#728077] dark:text-[#dce8e0]">
                <FiMail />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@abron.com"
                className="w-full rounded-lg border border-[#e8dcc5] dark:border-[#2d413b] bg-[#fffaf4] dark:bg-[#14261a] py-2.5 pl-10 pr-4 text-sm text-[#1f2e28] dark:text-[#edf5ee] focus:border-[#2f5d4a] dark:focus:border-[#f4c867] focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#24382f] dark:text-[#f5f0e8] mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#728077] dark:text-[#dce8e0]">
                <FiLock />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#e8dcc5] dark:border-[#2d413b] bg-[#fffaf4] dark:bg-[#14261a] py-2.5 pl-10 pr-4 text-sm text-[#1f2e28] dark:text-[#edf5ee] focus:border-[#2f5d4a] dark:focus:border-[#f4c867] focus:outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-[#2f5d4a] py-3 text-sm font-bold text-white transition hover:bg-[#1e4033] shadow-[0_10px_18px_rgba(47,93,74,0.25)]"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
