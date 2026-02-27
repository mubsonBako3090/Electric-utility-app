'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import Button from '../ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚖️</span>
          <span className={styles.logoText}>JusticeConnect NG</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <div className={styles.navLinks}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className={styles.navActions}>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className={styles.userInfo}>
                  <span className={styles.userAvatar}>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                  <span className={styles.userName}>
                    {user?.firstName}
                  </span>
                </Link>
                <Button variant="outline" size="small" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="small">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="small">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={styles.hamburger}></span>
        </button>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.active : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className={styles.mobileActions}>
            {isAuthenticated ? (
              <>
                <Link href="/profile" className={styles.mobileUser}>
                  Profile
                </Link>
                <Button variant="outline" fullWidth onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className={styles.mobileAuthLink}>
                  Login
                </Link>
                <Link href="/register" className={styles.mobileAuthLink}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
