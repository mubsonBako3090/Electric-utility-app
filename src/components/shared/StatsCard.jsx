import React from 'react';
import styles from './StatsCard.module.css';
import Card from '../ui/Card';
import clsx from 'clsx';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  color = 'primary',
  loading = false,
  onClick
}) => {
  const trendDirection = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <Card 
      variant="elevated" 
      padding="medium"
      className={clsx(styles.statsCard, onClick && styles.clickable)}
      onClick={onClick}
    >
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.shimmer}></div>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <span className={clsx(styles.icon, styles[color])}>{icon}</span>
            <span className={styles.title}>{title}</span>
          </div>
          
          <div className={styles.content}>
            <span className={styles.value}>{value}</span>
            
            {trend && (
              <span className={clsx(
                styles.trend,
                styles[trend]
              )}>
                {trendDirection} {trendValue}%
              </span>
            )}
          </div>
        </>
      )}
    </Card>
  );
};

export default StatsCard;
