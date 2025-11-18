"use client";
import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "@/styles/components/Auth.module.css";

export default function AuthModal({
  defaultView = "login",
  onClose,
  show = false,
}) {
  const [currentView, setCurrentView] = useState(defaultView);
  const [isOpen, setIsOpen] = useState(show);

  // Sync with show prop
  useEffect(() => {
    setIsOpen(show);
  }, [show]);

  // Set default view when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentView(defaultView);
    }
  }, [isOpen, defaultView]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const switchView = (view) => {
    setCurrentView(view);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.authModalOverlay} onClick={handleClose}>
      <div
        className={styles.authModalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {currentView === "login" ? (
          <LoginForm
            onSwitchToRegister={() => switchView("register")}
            onClose={handleClose}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => switchView("login")}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}

// Hook to control auth modal from any component
export function useAuthModal() {
  const [modalState, setModalState] = useState({
    show: false,
    view: "login",
  });

  const openLogin = () => setModalState({ show: true, view: "login" });
  const openRegister = () => setModalState({ show: true, view: "register" });
  const closeModal = () => setModalState({ show: false, view: "login" });

  return {
    show: modalState.show,
    view: modalState.view,
    openLogin,
    openRegister,
    closeModal,
    AuthModalComponent: () => (
      <AuthModal
        show={modalState.show}
        defaultView={modalState.view}
        onClose={closeModal}
      />
    ),
  };
}

// Standalone login modal component
export function LoginModal({ show, onClose }) {
  return <AuthModal show={show} defaultView="login" onClose={onClose} />;
}

// Standalone register modal component
export function RegisterModal({ show, onClose }) {
  return <AuthModal show={show} defaultView="register" onClose={onClose} />;
}
