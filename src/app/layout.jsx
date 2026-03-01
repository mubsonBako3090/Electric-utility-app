import { Inter } from 'next/font/google';
import './globals.css
import styles from './layout.module.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/providers/AuthProvider';
import { NotificationProvider } from '@/lib/providers/NotificationProvider';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={styles.body}>
        <AuthProvider>
          <NotificationProvider>
            <div className={styles.appWrapper}>
              <Navbar />
              <main className={styles.mainContent}>
                {children}
              </main>
              <Footer />
            </div>
          </NotificationProvider>
        </AuthProvider>
        
        <a href="#main-content" className={styles.skipLink}>
          Skip to main content
        </a>
      </body>
    </html>
  );
}
