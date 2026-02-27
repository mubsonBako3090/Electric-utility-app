import React from 'react';
import styles from './StatusBadge.module.css';
import clsx from 'clsx';

const StatusBadge = ({ status, size = 'medium' }) => {
  const statusConfig = {
    draft: { label: 'Draft', className: styles.draft },
    submitted: { label: 'Submitted', className: styles.submitted },
    under_review: { label: 'Under Review', className: styles.underReview },
    assigned: { label: 'Assigned', className: styles.assigned },
    investigating: { label: 'Investigating', className: styles.investigating },
    mediation: { label: 'Mediation', className: styles.mediation },
    resolved: { label: 'Resolved', className: styles.resolved },
    closed: { label: 'Closed', className: styles.closed },
    rejected: { label: 'Rejected', className: styles.rejected },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span className={clsx(
      styles.badge,
      config.className,
      styles[size]
    )}>
      <span className={styles.dot}></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
