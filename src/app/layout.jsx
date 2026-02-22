import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AuthModalProvider } from '@/context/AuthModalContext';
import ToastProvider from '@/components/ui/ToastProvider';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Rigyasa Electric - Powering Your Future',
  description: 'Electricity distribution management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        
            <ToastProvider />
            <AuthModals />
            {children}
      
        </AuthProvider>
      </body>
    </html>
  );
}
