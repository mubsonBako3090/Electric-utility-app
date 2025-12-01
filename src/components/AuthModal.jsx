'use client';
import { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthModal = () => {
  const [mode, setMode] = useState('login');
  const { showAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Sync isOpen with AuthContext
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

    // Only render the form; forms handle overlay & close
    return mode === 'login' ? (
      <Login onSwitchToRegister={() => setMode('register')} onClose={closeModal} />
    ) : (
      <Register onSwitchToLogin={() => setMode('login')} onClose={closeModal} />
    );
  };

  return { openLogin, openRegister, AuthModalComponent };
};
