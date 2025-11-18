"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openAuth = useCallback(() => setShowAuthModal(true), []);
  const closeAuth = useCallback(() => setShowAuthModal(false), []);

  // Fetch user profile from your API route (include credentials to send cookies)
  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profile", { credentials: 'include' });
        if (!res.ok) {
          // Not authenticated or server error
          if (mounted) setUser(null);
          return;
        }

        const data = await res.json();
        if (mounted) setUser(data?.data?.user || null);
      } catch (err) {
        console.error("AuthContext fetchUser error:", err);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUser();

    return () => { mounted = false; };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, showAuthModal, openAuth, closeAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
