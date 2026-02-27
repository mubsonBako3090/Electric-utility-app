import React from 'react';
import styles from './Badge.module.css';
import clsx from 'clsx';

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  rounded = true,
  icon,
  ...props
}) => {
  return (
    <span
      className={clsx(
        styles.badge,
        styles[variant],
        styles[size],
        rounded && styles.rounded
      )}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.content}>{children}</span>
    </span>
  );
};

export default Badge;
