import React from 'react';
import styles from './PriorityTag.module.css';
import clsx from 'clsx';

const PriorityTag = ({ priority, size = 'medium' }) => {
  const priorityConfig = {
    normal: { label: 'Normal', className: styles.normal, icon: '⚪' },
    urgent: { label: 'Urgent', className: styles.urgent, icon: '🟡' },
    emergency: { label: 'EMERGENCY', className: styles.emergency, icon: '🔴' },
  };

  const config = priorityConfig[priority] || priorityConfig.normal;

  return (
    <span className={clsx(
      styles.tag,
      config.className,
      styles[size]
    )}>
      <span className={styles.icon}>{config.icon}</span>
      {config.label}
    </span>
  );
};

export default PriorityTag;
