'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './ReceptionistLayout.module.css';

export default function ReceptionistLayout({ children }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { path: '/receptionist', icon: '📊', label: 'Dashboard' },
    { path: '/receptionist/appointments', icon: '📅', label: 'Appointments' },
    { path: '/receptionist/patients', icon: '👥', label: 'Patients' },
    { path: '/receptionist/register', icon: '📝', label: 'Register Patient' },
    { path: '/receptionist/billing', icon: '💰', label: 'Billing' },
    { path: '/receptionist/payments', icon: '💳', label: 'Payments' },
    { path: '/receptionist/check-in', icon: '✅', label: 'Check-In' },
    { path: '/receptionist/schedule', icon: '⏰', label: 'Schedule' }
  ];

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🏥</span>
            {!sidebarCollapsed && <span className={styles.logoText}>Reception Desk</span>}
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
              {item.label === 'Appointments' && (
                <span className={styles.badge}>12</span>
              )}
              {item.label === 'Payments' && (
                <span className={`${styles.badge} ${styles.paymentBadge}`}>3</span>
              )}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.quickStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>24</span>
              <span className={styles.statLabel}>Today</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>8</span>
              <span className={styles.statLabel}>Waiting</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>16</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
          </div>

          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>👩‍💼</div>
            {!sidebarCollapsed && (
              <div className={styles.userDetails}>
                <span className={styles.userName}>Sarah Johnson</span>
                <span className={styles.userRole}>Receptionist</span>
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
            <p className={styles.date}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.clock}>
              <span className={styles.time}>
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>

            <button className={styles.notificationBtn}>
              🔔
              <span className={styles.notificationBadge}>5</span>
            </button>

            <button className={styles.profileBtn}>
              👩‍💼
            </button>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>

        {/* Quick Actions Bar */}
        <div className={styles.quickActionsBar}>
          <button className={styles.quickAction}>
            <span className={styles.quickIcon}>📅</span>
            <span>New Appointment</span>
          </button>
          <button className={styles.quickAction}>
            <span className={styles.quickIcon}>👤</span>
            <span>Register Patient</span>
          </button>
          <button className={styles.quickAction}>
            <span className={styles.quickIcon}>💰</span>
            <span>Process Payment</span>
          </button>
          <button className={styles.quickAction}>
            <span className={styles.quickIcon}>✅</span>
            <span>Check-In</span>
          </button>
        </div>
      </main>
    </div>
  );
}
