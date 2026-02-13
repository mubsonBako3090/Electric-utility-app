'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import styles from './Sidebar.module.css';

export default function Sidebar({ userRole }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const getNavItems = () => {
    const commonItems = [
      { href: `/${userRole}`, icon: '📊', label: 'Dashboard' },
    ];

    const roleSpecificItems = {
      admin: [
        { href: '/admin/patients', icon: '👥', label: 'Patients' },
        { href: '/admin/doctors', icon: '👨‍⚕️', label: 'Doctors' },
        { href: '/admin/staff', icon: '🧑‍💼', label: 'Staff' },
        { href: '/admin/appointments', icon: '📅', label: 'Appointments' },
        { href: '/admin/billing', icon: '💰', label: 'Billing' },
        { href: '/admin/reports', icon: '📊', label: 'Reports' },
        { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
      ],
      doctor: [
        { href: '/doctor/appointments', icon: '📅', label: 'Appointments' },
        { href: '/doctor/patients', icon: '👥', label: 'My Patients' },
        { href: '/doctor/medical-records', icon: '📋', label: 'Medical Records' },
        { href: '/doctor/schedule', icon: '⏰', label: 'Schedule' },
      ],
      receptionist: [
        { href: '/receptionist/appointments', icon: '📅', label: 'Appointments' },
        { href: '/receptionist/patients', icon: '👥', label: 'Patients' },
        { href: '/receptionist/billing', icon: '💰', label: 'Billing' },
        { href: '/receptionist/register', icon: '📝', label: 'Register Patient' },
      ],
      patient: [
        { href: '/patient/appointments', icon: '📅', label: 'My Appointments' },
        { href: '/patient/medical-records', icon: '📋', label: 'Medical Records' },
        { href: '/patient/billing', icon: '💰', label: 'Billing' },
        { href: '/patient/profile', icon: '👤', label: 'Profile' },
      ],
    };

    return [...commonItems, ...(roleSpecificItems[userRole] || [])];
  };

  const navItems = getNavItems();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        <Image 
          src="/images/logo.svg" 
          alt="Hospital Logo" 
          width={40} 
          height={40} 
          className={styles.logo}
        />
        {!collapsed && <span className={styles.hospitalName}>City Hospital</span>}
        <button 
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <button 
          className={styles.logoutBtn}
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <span className={styles.navIcon}>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
