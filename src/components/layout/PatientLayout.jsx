'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './PatientLayout.module.css';

export default function PatientLayout({ children }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/patient', icon: '📊', label: 'Dashboard' },
    { path: '/patient/appointments', icon: '📅', label: 'My Appointments' },
    { path: '/patient/medical-records', icon: '📋', label: 'Medical Records' },
    { path: '/patient/billing', icon: '💰', label: 'Billing' },
    { path: '/patient/prescriptions', icon: '💊', label: 'Prescriptions' },
    { path: '/patient/messages', icon: '💬', label: 'Messages' },
    { path: '/patient/profile', icon: '👤', label: 'Profile' },
    { path: '/patient/settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <div className={styles.container}>
      {/* Mobile Menu Toggle */}
      <button 
        className={styles.menuToggle}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🏥</span>
            {!sidebarCollapsed && <span className={styles.logoText}>Patient Portal</span>}
          </div>
          <button 
            className={styles.collapseBtn}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <div className={styles.patientInfo}>
          <div className={styles.patientAvatar}>
            <img src="/images/patient-avatar.jpg" alt="Patient" />
          </div>
          {!sidebarCollapsed && (
            <div className={styles.patientDetails}>
              <h4>John Doe</h4>
              <p>ID: P-12345</p>
            </div>
          )}
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!sidebarCollapsed && <span className={styles.navLabel}>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          {!sidebarCollapsed && (
            <>
              <div className={styles.healthSummary}>
                <h4>Health Summary</h4>
                <div className={styles.healthStats}>
                  <div className={styles.healthStat}>
                    <span className={styles.statValue}>120/80</span>
                    <span className={styles.statLabel}>BP</span>
                  </div>
                  <div className={styles.healthStat}>
                    <span className={styles.statValue}>72</span>
                    <span className={styles.statLabel}>HR</span>
                  </div>
                  <div className={styles.healthStat}>
                    <span className={styles.statValue}>98%</span>
                    <span className={styles.statLabel}>O2</span>
                  </div>
                </div>
              </div>

              <button className={styles.emergencyBtn}>
                🚨 Emergency Contact
              </button>
            </>
          )}
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.welcomeMessage}>
              Welcome back, <span className={styles.patientName}>John!</span>
            </h1>
            <p className={styles.lastVisit}>Last visit: March 15, 2024</p>
          </div>

          <div className={styles.headerRight}>
            <button className={styles.notificationBtn}>
              🔔
              <span className={styles.notificationBadge}>2</span>
            </button>

            <div className={styles.appointmentReminder}>
              <span className={styles.reminderIcon}>⏰</span>
              <div className={styles.reminderText}>
                <span>Next Appointment</span>
                <strong>Tomorrow at 10:00 AM</strong>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <button className={styles.quickAction}>
            <span className={styles.quickIcon}>📅</span>
            <span>Book</span>
          </button>
          <button className={styles.quickAction}>
            <span className={styles.quickIcon}>💬</span>
            <span>Message</span>
          </button>
          <button className={styles.quickAction}>
            <span className={styles.quickIcon}>💊</span>
            <span>Refill</span>
          </button>
          <button className={styles.quickAction}>
            <span className={styles.quickIcon}>💰</span>
            <span>Pay</span>
          </button>
        </div>
      </main>
    </div>
  );
            }
