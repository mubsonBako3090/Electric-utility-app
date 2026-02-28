import { Inter } from 'next/font/google';
import styles from './layout.module.css';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/providers/AuthProvider';
import { NotificationProvider } from '@/lib/providers/NotificationProvider';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: {
    default: 'JusticeConnect NG - Public Complaint Resolution Platform',
    template: '%s | JusticeConnect NG'
  },
  description: 'A digital platform for Nigerian citizens to report injustices, track cases, and connect with mediators for fair resolution.',
  keywords: ['justice', 'complaint', 'Nigeria', 'human rights', 'legal aid', 'mediation'],
  authors: [{ name: 'JusticeConnect NG' }],
  creator: 'JusticeConnect NG',
  publisher: 'JusticeConnect NG',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://justiceconnect.ng'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'ha': '/ha',
      'yo': '/yo',
      'ig': '/ig',
    },
  },
  openGraph: {
    title: 'JusticeConnect NG',
    description: 'Speak Up. Get Justice. Track Progress.',
    url: 'https://justiceconnect.ng',
    siteName: 'JusticeConnect NG',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JusticeConnect NG - Nigerian Public Complaint Resolution Platform',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JusticeConnect NG',
    description: 'Speak Up. Get Justice. Track Progress.',
    images: ['/og-image.png'],
    creator: '@justiceconnect_ng',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#1E3A8A',
      },
    ],
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#1E3A8A',
  appleWebApp: {
    title: 'JusticeConnect NG',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/apple-splash-2048-2732.png',
    ],
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    bing: 'bing-verification-code',
  },
  category: 'legal services',
};

export const viewport = {
  themeColor: '#1E3A8A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA Primary Color */}
        <meta name="theme-color" content="#1E3A8A" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#1E3A8A" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-icon-180x180.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1E3A8A" />
      </head>
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
        
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className={styles.skipLink}>
          Skip to main content
        </a>
      </body>
    </html>
  );
        }
