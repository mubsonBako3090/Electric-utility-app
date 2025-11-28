'use client';

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openAuth = useCallback(() => setShowAuthModal(true), []);
  const closeAuth = useCallback(() => setShowAuthModal(false), []);

  // LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) return { success: false, error: data.error || "Login failed" };

      setUser(data.user);
      closeAuth();
      router.push("/dashboard"); // ✅ Redirect after login

      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Something went wrong" };
    }
  };

  // REGISTER FUNCTION
  const register = async (userData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) return { success: false, error: data.error || "Registration failed" };

      setUser(data.user);
      closeAuth();
      router.push("/dashboard"); // ✅ Redirect after register

      return { success: true };
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, error: "Something went wrong" };
    }
  };

  // FETCH USER SESSION WHEN APP LOADS
  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/profile", { credentials: "include" });

        if (!res.ok) {
          if (mounted) setUser(null);
          return;
        }

        const data = await res.json();
        if (mounted) setUser(data?.data?.user || null);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUser();
    return () => { mounted = false; };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        showAuthModal,
        openAuth,
        closeAuth,
        login,
        register,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
