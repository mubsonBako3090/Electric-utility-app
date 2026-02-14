
'use client';

import styles from './Card.module.css';

export default function Card({ 
  children, 
  title,
  subtitle,
  headerAction,
  className = '',
  padding = 'normal',
  hoverable = false,
  bordered = true,
  ...props 
}) {
  return (
    <div 
      className={`
        ${styles.card} 
        ${styles[padding]} 
        ${hoverable ? styles.hoverable : ''} 
        ${bordered ? styles.bordered : ''}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {headerAction && (
            <div className={styles.headerAction}>
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className={styles.body}>
        {children}
      </div>
    </div>
  );
            }
