'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      
      if (res.ok && data.user) {
        setUser(data.user);
        // You might want to store token in memory or context
        // Token is typically in HTTP-only cookie, so we don't have direct access
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        toast.success('Login successful!');
        
        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (data.user.role === 'field-officer') {
          router.push('/dashboard/field-officer');
        } else if (data.user.role === 'customer') {
          router.push(`/dashboard/customer/${data.user.customerCategory}`);
        } else {
          router.push('/dashboard');
        }
        
        return { success: true, user: data.user };
      } else {
        toast.error(data.message || 'Login failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong');
      return { success: false, error: error.message };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Registration successful! Please login.');
        router.push('/login');
        return { success: true };
      } else {
        toast.error(data.message || 'Registration failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Something went wrong');
      return { success: false, error: error.message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        setUser(null);
        toast.success('Logged out successfully');
        router.push('/login');
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Something went wrong');
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const res = await fetch('/api/customers/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (res.ok) {
        setUser({ ...user, ...profileData });
        toast.success('Profile updated successfully');
        return { success: true };
      } else {
        toast.error(data.message || 'Profile update failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Something went wrong');
      return { success: false, error: error.message };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Password changed successfully');
        return { success: true };
      } else {
        toast.error(data.message || 'Password change failed');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Something went wrong');
      return { success: false, error: error.message };
    }
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!user) return false;
    
    // Define permissions by role
    const permissions = {
      admin: [
        'view_all',
        'manage_users',
        'manage_feeders',
        'manage_billing',
        'view_reports',
        'verify_customers',
        'manage_officers',
      ],
      'field-officer': [
        'view_assigned',
        'record_readings',
        'inspect_meters',
        'report_outages',
        'verify_customers',
      ],
      customer: [
        'view_own_bills',
        'view_own_usage',
        'report_outage',
        'declare_vacation',
        'view_own_profile',
      ],
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  // Refresh user data
  const refreshUser = async () => {
    await checkAuth();
  };

  // Get user role
  const getUserRole = () => {
    return user?.role || null;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Get user display name
  const getDisplayName = () => {
    if (!user) return '';
    return user.name || user.email?.split('@')[0] || 'User';
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasPermission,
    refreshUser,
    getUserRole,
    isAuthenticated,
    getDisplayName,
    checkAuth,
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
          }
