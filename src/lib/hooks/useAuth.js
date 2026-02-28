'use client';

import { useContext, createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/axios';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check authentication status
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, refreshToken, user } = response.data;

      // Store tokens
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Set user
      setUser(user);

      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/register', userData);
      const { token, refreshToken, user } = response.data;

      // Store tokens
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Set user
      setUser(user);

      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Clear user state
      setUser(null);
      
      // Redirect to login
      router.push('/login');
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      return true;
    } catch (err) {
      console.error('Token refresh failed:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      return false;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put('/users/profile', profileData);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Password change failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password request
  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/forgot-password', { email });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Password reset request failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/reset-password', { token, newPassword });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Password reset failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  // Check if user is mediator
  const isMediator = user?.role === 'mediator';

  // Check if user is citizen
  const isCitizen = user?.role === 'citizen';

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    checkAuth,
    hasRole,
    hasAnyRole,
    isAuthenticated,
    isAdmin,
    isMediator,
    isCitizen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Role-based guard HOC
export function withAuth(Component, requiredRoles = []) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, hasAnyRole, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.push('/login');
        } else if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
          router.push('/unauthorized');
        }
      }
    }, [loading, isAuthenticated, hasAnyRole, router]);

    if (loading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <div className="spinner" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
      return null;
    }

    return <Component {...props} />;
  };
}

export default useAuth;
