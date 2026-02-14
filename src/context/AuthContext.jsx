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

  const hasPermission =
