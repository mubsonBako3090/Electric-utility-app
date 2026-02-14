'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/patients', icon: '👥', label: 'Patients' },
    { path: '/admin/doctors', icon: '👨‍⚕️', label: 'Doctors' },
    { path: '/admin/staff', icon: '🧑‍💼', label: 'Staff' },
    { path: '/admin/appointments', icon: '📅', label: 'Appointments' },
    { path: '/admin/billing', icon: '💰', label: 'Billing' },
    { path: '/admin/reports', icon: '📊', label: 'Reports' },
    { path: '/admin/settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🏥</span>
            {!sidebarCollapsed && <span className={styles.logoText}>Admin Panel</span>}
          </div>
          <button 
            className={styles.collapseBtn}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!sidebarCollapsed && <span className={styles.navLabel}>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>👤</div>
            {!sidebarCollapsed && (
              <div className={styles.userDetails}>
                <span className={styles.userName}>Admin User</span>
                <span className={styles.userRole}>Administrator</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>
              {menuItems.find(item => item.path === pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.notificationBtn}>🔔</button>
            <button className={styles.profileBtn}>👤</button>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
     }
