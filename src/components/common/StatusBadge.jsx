'use client';

import styles from './StatusBadge.module.css';

export default function StatusBadge({ 
  status, 
  size = 'medium',
  showIcon = true,
  pulse = false 
}) {
  const getIcon = () => {
    const icons = {
      active: '●',
      inactive: '○',
      pending: '⏳',
      confirmed: '✓',
      cancelled: '✕',
      completed: '✓',
      'in-progress': '⚙️',
      paid: '💰',
      unpaid: '💳',
      overdue: '⚠️',
      critical: '⚠️',
      stable: '●',
      discharged: '✓'
    };
    return icons[status] || '●';
  };

  return (
    <span className={`
      ${styles.badge} 
      ${styles[size]} 
      ${styles[status]}
      ${pulse ? styles.pulse : ''}
    `}>
      {showIcon && <span className={styles.icon}>{getIcon()}</span>}
      <span className={styles.text}>{status}</span>
    </span>
  );
}
