'use client';

import Header from '@/components/ui/Header';
import Footer from '@/components/Footer';
import styles from '@/styles/Legal.module.css';

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className={styles.legalContainer}>
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>At PowerGrid Utilities, we value your privacy. This page explains how we collect, use, and protect your personal information...</p>
          {/* Add full privacy content here */}
        </div>
      </main>
      <Footer />
    </>
  );
}
