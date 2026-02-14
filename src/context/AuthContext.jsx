'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else {
      setUser(session?.user || null);
      setLoading(false);
      
      // Set permissions based on role
      if (session?.user) {
        const rolePermissions = getPermissionsByRole(session.user.role);
        setPermissions(rolePermissions);
      } else {
        setPermissions([]);
      }
    }
  }, [session, status]);

  const getPermissionsByRole = (role) => {
    const permissionsMap = {
      admin: [
        'view_dashboard',
        'manage_patients',
        'manage_doctors',
        'manage_staff',
        'manage_appointments',
        'manage_billing',
        'view_reports',
        'manage_settings',
        'manage_users'
      ],
      doctor: [
        'view_dashboard',
        'view_patients',
        'manage_medical_records',
        'manage_prescriptions',
        'view_appointments',
        'manage_own_schedule'
      ],
      receptionist: [
        'view_dashboard',
        'manage_appointments',
        'register_patients',
        'process_payments',
        'view_billing'
      ],
      patient: [
        'view_dashboard',
        'view_own_appointments',
        'view_own_medical_records',
        'view_own_billing',
        'book_appointments'
      ]
    };

    return permissionsMap[role] || [];
  };

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions) => {
    return requiredPermissions.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (requiredPermissions) => {
    return requiredPermissions.every(permission => permissions.includes(permission));
  };

  const login = async (email, password, role) => {
    // This is handled by next-auth
    return { success: true };
  };

  const logout = async () => {
    // This is handled by next-auth
    router.push('/login');
  };

  const updateUserProfile = async (userData) => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(prev => ({ ...prev, ...data.user }));
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for role-based protection
export function withRole(Component, allowedRoles) {
  return function WithRole(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && (!user || !allowedRoles.includes(user.role))) {
        router.push('/unauthorized');
      }
    }, [user, loading, router]);

    if (loading || !user || !allowedRoles.includes(user.role)) {
      return null;
    }

    return <Component {...props} />;
  };
}

// Higher-order component for permission-based protection
export function withPermission(Component, requiredPermission) {
  return function WithPermission(props) {
    const { hasPermission, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !hasPermission(requiredPermission)) {
        router.push('/unauthorized');
      }
    }, [hasPermission, loading, router]);

    if (loading || !hasPermission(requiredPermission)) {
      return null;
    }

    return <Component {...props} />;
  };
      }
