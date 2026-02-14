'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './DoctorLayout.module.css';

export default function DoctorLayout({ children }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { path: '/doctor', icon: '📊', label: 'Dashboard' },
    { path: '/doctor/appointments', icon: '📅', label: 'My Appointments' },
    { path: '/doctor/patients', icon: '👥', label: 'My Patients' },
    { path: '/doctor/medical-records', icon: '📋', label: 'Medical Records' },
    { path: '/doctor/schedule', icon: '⏰', label: 'My Schedule' },
    { path: '/doctor/prescriptions', icon: '💊', label: 'Prescriptions' },
    { path: '/doctor/reports', icon: '📊', label: 'Reports' },
    { path: '/doctor/profile', icon: '👤', label: 'Profile' }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>👨‍⚕️</span>
            {!sidebarCollapsed && <span className={styles.logoText}>Doctor Portal</span>}
          </div>
          <button 
            className={styles.collapseBtn}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <div className={styles.doctorInfo}>
          <div className={styles.doctorAvatar}>
            <img src="/images/doctor-avatar.jpg" alt="Dr. Smith" />
          </div>
          {!sidebarCollapsed && (
            <div className={styles.doctorDetails}>
              <h4>Dr. John Smith</h4>
              <p>Cardiologist</p>
              <span className={styles.status}>● Available</span>
            </div>
          )}
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
              {item.label === 'Appointments' && !sidebarCollapsed && (
                <span className={styles.badge}>5</span>
              )}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>12</span>
              <span className={styles.statLabel}>Today</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>8</span>
              <span className={styles.statLabel}>Pending</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>4.8</span>
              <span className={styles.statLabel}>Rating</span>
            </div>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.greeting}>
              {getGreeting()}, <span className={styles.doctorName}>Dr. Smith</span>
            </h1>
            <p className={styles.date}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input 
                type="text" 
                placeholder="Search patients..." 
                className={styles.searchInput}
              />
            </div>

            <button className={styles.notificationBtn}>
              🔔
              <span className={styles.notificationBadge}>3</span>
            </button>

            <div className={styles.profileMenu}>
              <button className={styles.profileBtn}>
                <img src="/images/doctor-avatar.jpg" alt="Dr. Smith" />
              </button>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>

        {/* Quick Actions Floating Button */}
        <div className={styles.quickActions}>
          <button className={styles.quickActionBtn} title="Add Medical Record">
            📝
          </button>
          <button className={styles.quickActionBtn} title="Write Prescription">
            💊
          </button>
          <button className={styles.quickActionBtn} title="Schedule Appointment">
            📅
          </button>
          <button className={styles.quickActionBtn} title="Message Patient">
            💬
          </button>
        </div>
      </main>
    </div>
  );
}
