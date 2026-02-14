'use client';

import { useEffect } from 'react';
import Button from './Button';
import styles from './Modal.module.css';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnClickOutside = true,
  footer,
  ...props 
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClickOutside = (e) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClickOutside}>
      <div className={`${styles.modal} ${styles[size]}`} {...props}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {showCloseButton && (
            <button onClick={onClose} className={styles.closeButton}>
              ✕
            </button>
          )}
        </div>
        
        <div className={styles.body}>
          {children}
        </div>
        
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
      }
