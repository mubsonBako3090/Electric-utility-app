'use client';

import Header from '@/components/ui/Header';
import Footer from '@/components/Footer';
import styles from '@/styles/Legal.module.css';

export default function TermsOfService() {
  return (
    <>
      <Header />
      <main className={styles.legalContainer}>
        <div className="container">
          <h1>Terms of Service</h1>
          <p>Welcome to PowerGrid Utilities. By using our services, you agree to the following terms and conditions...</p>
          {/* Add full terms content here */}
        </div>
      </main>
      <Footer />
    </>
  );
}
