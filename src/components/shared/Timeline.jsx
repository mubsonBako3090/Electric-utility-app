import React from 'react';
import styles from './Timeline.module.css';
import clsx from 'clsx';

const Timeline = ({ items, alternate = false }) => {
  return (
    <div className={clsx(styles.timeline, alternate && styles.alternate)}>
      {items.map((item, index) => (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineMarker}>
            <span className={clsx(styles.dot, styles[item.status || 'default'])} />
            {index < items.length - 1 && <span className={styles.line} />}
          </div>
          
          <div className={styles.timelineContent}>
            <div className={styles.timelineHeader}>
              <span className={styles.timelineTime}>{item.time}</span>
              <span className={styles.timelineStatus}>{item.status}</span>
            </div>
            
            <h4 className={styles.timelineTitle}>{item.title}</h4>
            <p className={styles.timelineDescription}>{item.description}</p>
            
            {item.metadata && (
              <div className={styles.timelineMetadata}>
                {Object.entries(item.metadata).map(([key, value]) => (
                  <div key={key} className={styles.metadataItem}>
                    <span className={styles.metadataKey}>{key}:</span>
                    <span className={styles.metadataValue}>{value}</span>
                  </div>
                ))}
              </div>
            )}
            
            {item.actions && (
              <div className={styles.timelineActions}>
                {item.actions}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
