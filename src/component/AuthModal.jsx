'use client';
import { useState } from 'react';
import Login from '@/Login';
import Register from '@/Register';
import styles from '@/styles/Login.module.css';

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'

  const openModal = (view = 'login') => {
    setCurrentView(view);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const switchView = (view) => {
    setCurrentView(view);
  };

  if (!isOpen) return null;

  return (
    <>
      {currentView === 'login' ? (
        <Login 
          onSwitchToRegister={() => switchView('register')}
          onClose={closeModal}
        />
      ) : (
        <Register 
          onSwitchToLogin={() => switchView('login')}
          onClose={closeModal}
        />
      )}
    </>
  );
}

// Export hook to control modal from other components
export const useAuthModal = () => {
  const [modal, setModal] = useState(null);

  const openLogin = () => setModal('login');
  const openRegister = () => setModal('register');
  const closeModal = () => setModal(null);

  return {
    modal,
    openLogin,
    openRegister,
    closeModal
  };
};

