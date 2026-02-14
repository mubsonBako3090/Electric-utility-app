'use client';

import { useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async (email, password, role) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        role,
        redirect: false
      });

      if (result.error) {
        throw new Error(result.error);
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const checkPermission = (requiredRole) => {
    if (!session?.user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(session.user.role);
    }
    
    return session.user.role === requiredRole;
  };

  const hasAnyRole = (roles) => {
    if (!session?.user) return false;
    return roles.includes(session.user.role);
  };

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user || null;

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    checkPermission,
    hasAnyRole,
    role: user?.role,
    session
  };
}

// Role-based permission hooks
export function useAdmin() {
  const { checkPermission } = useAuth();
  return checkPermission('admin');
}

export function useDoctor() {
  const { checkPermission } = useAuth();
  return checkPermission('doctor');
}

export function useReceptionist() {
  const { checkPermission } = useAuth();
  return checkPermission('receptionist');
}

export function usePatient() {
  const { checkPermission } = useAuth();
  return checkPermission('patient');
}

// Permission guard HOC
export function withAuth(Component, requiredRole) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, checkPermission, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      } else if (!isLoading && requiredRole && !checkPermission(requiredRole)) {
        router.push('/unauthorized');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated || (requiredRole && !checkPermission(requiredRole))) {
      return null;
    }

    return <Component {...props} />;
  };
  }
