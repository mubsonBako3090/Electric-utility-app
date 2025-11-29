'use client';
import { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import styles from '@/styles/Login.module.css';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthModal = () => {
  const [mode, setMode] = useState('login');
  const { showAuthModal } = useAuth(); // your existing AuthContext
  const [isOpen, setIsOpen] = useState(false);

  // Sync isOpen with showAuthModal
  useEffect(() => {
    setIsOpen(showAuthModal);
  }, [showAuthModal]);

  const openLogin = () => {
    setMode('login');
    setIsOpen(true);
  };

  const openRegister = () => {
    setMode('register');
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const AuthModalComponent = () => {
    if (!isOpen) return null;

    return (
      <div className={styles.authModal}>
        <div className={styles.authContent}>
          <button className={styles.closeButton} onClick={closeModal}>
            <i className="bi bi-x-lg"></i>
          </button>

          {mode === 'login' ? (
            <Login
              onSwitchToRegister={() => setMode('register')}
              onClose={closeModal} // pass close to login
            />
          ) : (
            <Register
              onSwitchToLogin={() => setMode('login')}
              onClose={closeModal} // pass close to register
            />
          )}
        </div>
      </div>
    );
  };

  return { openLogin, openRegister, AuthModalComponent };
};
