
// src/app/layout.js
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'
import NextAuthSessionProvider from "@/providers/SessionProvider";
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hospital Management System',
  description: 'Complete healthcare management solution',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>
         <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
    </NextAuthSessionProvider>
      </body>
    </html>
  )
    }
