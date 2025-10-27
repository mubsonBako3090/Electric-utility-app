'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/navbar.module.css';

export default function Navbar() {
  return (
  <nav className={`navbar navbar-expand-lg navbar-light fixed-top ${styles.navbar}`}>
      <div className="container">
        <Link href="/" className={`navbar-brand ${styles.brand}`}>
          <i className="bi bi-lightning-charge-fill me-2"></i>
          PowerGrid Utilities
        </Link>
        
        <button 
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse  'show' :${styles.navLink}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" className={`nav-link ${styles.navLink}`}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className={`nav-link ${styles.navLink}`}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/services" className={`nav-link ${styles.navLink}`}>
                Services
              </Link>
            </li>
            <li className="nav-item">
             <Link href="/outagemap" className="nav-link">
  Outage Map
</Link>

            </li>
            <li className="nav-item">
              <Link href="/contact" className={`nav-link ${styles.navLink}`}>
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <a href="#" className={`btn btn-primary ms-2 ${styles.loginBtn}`}>
                <i className="bi bi-person-circle me-2"></i>
                Customer Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

