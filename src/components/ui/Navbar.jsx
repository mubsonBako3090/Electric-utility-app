'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar({ user }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <h2 className={styles.greeting}>
          {getGreeting()}, <span className={styles.userName}>{user?.name}</span>
        </h2>
        <p className={styles.date}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className={styles.navRight}>
        {/* Search Bar */}
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Search..." 
            className={styles.searchInput}
          />
        </div>

        {/* Notifications */}
        <div className={styles.notificationContainer}>
          <button 
            className={styles.notificationBtn}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className={styles.notificationIcon}>🔔</span>
            <span className={styles.notificationBadge}>3</span>
          </button>
          
          {showNotifications && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <h3>Notifications</h3>
                <button>Mark all as read</button>
              </div>
              <div className={styles.notificationList}>
                <div className={styles.notificationItem}>
                  <p>New appointment scheduled</p>
                  <span>5 min ago</span>
                </div>
                <div className={styles.notificationItem}>
                  <p>Payment received from patient</p>
                  <span>1 hour ago</span>
                </div>
                <div className={styles.notificationItem}>
                  <p>Lab results ready</p>
                  <span>2 hours ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className={styles.profileContainer}>
          <button 
            className={styles.profileBtn}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <Image 
              src={user?.image || '/images/default-avatar.png'}
              alt={user?.name}
              width={40}
              height={40}
              className={styles.profileImage}
            />
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{user?.name}</span>
              <span className={styles.profileRole}>{user?.role}</span>
            </div>
            <span className={styles.dropdownIcon}>▼</span>
          </button>

          {showProfileMenu && (
            <div className={styles.profileDropdown}>
              <Link href="/profile" className={styles.dropdownItem}>
                <span>👤</span> My Profile
              </Link>
              <Link href="/settings" className={styles.dropdownItem}>
                <span>⚙️</span> Settings
              </Link>
              <hr className={styles.dropdownDivider} />
              <button className={styles.dropdownItem}>
                <span>🚪</span> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
      }
