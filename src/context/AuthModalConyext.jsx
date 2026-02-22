'use client';

import { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext({});

export function AuthModalProvider({ children }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Open login modal
  const openLogin = (data = null) => {
    setModalData(data);
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
    setIsResetPasswordOpen(false);
  };

  // Open register modal
  const openRegister = (data = null) => {
    setModalData(data);
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
    setIsForgotPasswordOpen(false);
    setIsResetPasswordOpen(false);
  };

  // Open forgot password modal
  const openForgotPassword = (data = null) => {
    setModalData(data);
    setIsForgotPasswordOpen(true);
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsResetPasswordOpen(false);
  };

  // Open reset password modal
  const openResetPassword = (data = null) => {
    setModalData(data);
    setIsResetPasswordOpen(true);
    setIsForgotPasswordOpen(false);
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  // Close all modals
  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
    setIsResetPasswordOpen(false);
    setModalData(null);
  };

  // Switch between modals
  const switchToLogin = (data = null) => {
    closeModals();
    openLogin(data);
  };

  const switchToRegister = (data = null) => {
    closeModals();
    openRegister(data);
  };

  const switchToForgotPassword = (data = null) => {
    closeModals();
    openForgotPassword(data);
  };

  const value = {
    // State
    isLoginOpen,
    isRegisterOpen,
    isForgotPasswordOpen,
    isResetPasswordOpen,
    modalData,

    // Open functions
    openLogin,
    openRegister,
    openForgotPassword,
    openResetPassword,

    // Close function
    closeModals,

    // Switch functions
    switchToLogin,
    switchToRegister,
    switchToForgotPassword,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}

// Custom hook to use auth modal context
export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
