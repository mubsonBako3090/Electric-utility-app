import React from 'react';
import styles from './Card.module.css';
import clsx from 'clsx';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'medium',
  hoverable = false,
  onClick,
  className,
  ...props 
}) => {
  return (
    <div
      className={clsx(
        styles.card,
        styles[variant],
        styles[`padding-${padding}`],
        hoverable && styles.hoverable,
        onClick && styles.clickable,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div className={clsx(styles.header, className)} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className, ...props }) => (
  <div className={clsx(styles.body, className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={clsx(styles.footer, className)} {...props}>
    {children}
  </div>
);

export default Card;
