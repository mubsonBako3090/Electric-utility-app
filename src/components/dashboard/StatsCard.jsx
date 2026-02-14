'use client';

import styles from './StatsCard.module.css';

export default function StatsCard({ title, value, icon, trend, color = 'primary' }) {
  const getColorClass = () => {
    const colors = {
      primary: styles.primary,
      success: styles.success,
      warning: styles.warning,
      danger: styles.danger,
      secondary: styles.secondary,
      info: styles.info
    };
    return colors[color] || styles.primary;
  };

  const getTrendIcon = (trend) => {
    if (!trend) return null;
    if (trend.includes('+')) return '📈';
    if (trend.includes('-')) return '📉';
    return '📊';
  };

  return (
    <div className={`${styles.card} ${getColorClass()}`}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>{icon}</span>
        <span className={styles.cardTitle}>{title}</span>
      </div>
      
      <div className={styles.cardBody}>
        <div className={styles.cardValue}>{value}</div>
        {trend && (
          <div className={styles.cardTrend}>
            <span className={styles.trendIcon}>{getTrendIcon(trend)}</span>
            <span className={styles.trendValue}>{trend}</span>
          </div>
        )}
      </div>
      
      <div className={styles.cardFooter}>
        <button className={styles.viewDetailsBtn}>View Details →</button>
      </div>
    </div>
  );
}
