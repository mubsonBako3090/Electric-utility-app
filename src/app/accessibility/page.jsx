'use client';

import Header from '@/components/ui/Header';
import Footer from '@/components/Footer';
import styles from '@/styles/Legal.module.css';

export default function Accessibility() {
  return (
    <>
      <Header />
      <main className={styles.legalContainer}>
        <div className="container">
          <h1>Accessibility</h1>
          <p>PowerGrid Utilities is committed to making our website accessible to all users. This page describes our accessibility efforts...</p>
          {/* Add full accessibility content here */}
        </div>
      </main>
      <Footer />
    </>
  );
}
