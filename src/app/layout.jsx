import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import layoutStyles from './layout.module.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { NotificationProvider } from '@/components/providers/NotificationProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SocketProvider } from '@/components/providers/SocketProvider'
import { Toaster } from '@/components/ui/Toast'

// Font configuration
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata = {
  title: {
    template: '%s | Public Complaint System',
    default: 'Public Complaint System - Lodge and Track Complaints',
  },
  description: 'A comprehensive platform for citizens to lodge complaints and track their resolution status with government agencies and mediators.',
  keywords: ['complaint', 'grievance', 'public service', 'mediation', 'citizen feedback'],
  authors: [{ name: 'Public Complaint System' }],
  creator: 'Public Complaint System',
  publisher: 'Public Complaint System',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Public Complaint System',
    description: 'Lodge and track complaints efficiently with our public complaint management system',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Public Complaint System',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Public Complaint System',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Public Complaint System',
    description: 'Lodge and track complaints efficiently with our public complaint management system',
    images: ['/og-image.png'],
    creator: '@pcsystem',
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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export const viewport = {
  themeColor: '#0a7cff',
}

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className={layoutStyles.body}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <SocketProvider>
                <div className={layoutStyles.root}>
                  {/* Skip to main content link for accessibility */}
                  <a href="#main-content" className={layoutStyles.skipLink}>
                    Skip to main content
                  </a>
                  
                  {/* Main content wrapper */}
                  <div className={layoutStyles.contentWrapper}>
                    <main id="main-content" className={layoutStyles.main}>
                      {children}
                    </main>
                  </div>
                  
                  {/* Toast notifications container */}
                  <Toaster 
                    position="top-right"
                    toastOptions={{
                      duration: 5000,
                      className: layoutStyles.toast,
                    }}
                  />
                </div>
              </SocketProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
    }
