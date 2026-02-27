import React from 'react';
import styles from './Alert.module.css';
import clsx from 'clsx';

const Alert = ({
  type = 'info',
  title,
  children,
  showIcon = true,
  closable = false,
  onClose,
  className,
  ...props
}) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={clsx(
        styles.alert,
        styles[type],
        className
      )}
      role="alert"
      {...props}
    >
      {showIcon && (
        <span className={styles.icon}>{icons[type]}</span>
      )}
      
      <div className={styles.content}>
        {title && <h4 className={styles.title}>{title}</h4>}
        <div className={styles.message}>{children}</div>
      </div>

      {closable && (
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
