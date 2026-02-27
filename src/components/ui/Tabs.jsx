'use client';

import React, { useState } from 'react';
import styles from './Tabs.module.css';
import clsx from 'clsx';

const Tabs = ({
  tabs,
  defaultActiveKey,
  activeKey,
  onChange,
  variant = 'underline',
  size = 'medium',
  centered = false,
  children,
}) => {
  const [internalActiveKey, setInternalActiveKey] = useState(defaultActiveKey || tabs[0]?.key);

  const currentActiveKey = activeKey !== undefined ? activeKey : internalActiveKey;

  const handleTabClick = (key) => {
    if (activeKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  return (
    <div className={styles.tabs}>
      <div className={clsx(
        styles.tabList,
        styles[variant],
        styles[size],
        centered && styles.centered
      )}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={clsx(
              styles.tab,
              currentActiveKey === tab.key && styles.active,
              tab.disabled && styles.disabled
            )}
            onClick={() => !tab.disabled && handleTabClick(tab.key)}
          >
            {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
            <span className={styles.tabLabel}>{tab.label}</span>
            {tab.badge && (
              <span className={styles.tabBadge}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>
      
      <div className={styles.tabContent}>
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={clsx(
              styles.tabPane,
              currentActiveKey === tab.key && styles.active
            )}
          >
            {tab.content || children?.[tab.key]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
