'use client';

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Derived state
  const isAuthenticated = !!user;

  const openAuth = useCallback(() => setShowAuthModal(true), []);
  const closeAuth = useCallback(() => setShowAuthModal(false), []);

  // LOGIN
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

      setUser(data.data.user);
      closeAuth();
      router.push("/dashboard");
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Something went wrong" };
    }
  };

  // REGISTER
  const register = async (userData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || "Registration failed" };

      setUser(data.data.user);
      closeAuth();
      router.push("/dashboard");
      return { success: true };
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, error: "Something went wrong" };
    }
  };

  // LOGOUT  ✅ ADDED
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      router.push("/");

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false };
    }
  };

  // FETCH USER SESSION
  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          credentials: "include",
        });

        if (!res.ok) {
          if (isMounted) setUser(null);
          return;
        }

        const data = await res.json();
        if (isMounted) setUser(data?.data?.user || null);

      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();
    return () => (isMounted = false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        showAuthModal,
        openAuth,
        closeAuth,
        login,
        register,
        logout,      // ✅ ADDED EXPORT
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
