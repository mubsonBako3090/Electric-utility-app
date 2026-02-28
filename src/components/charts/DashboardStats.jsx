'use client';

import React from 'react';
import styles from './DashboardStats.module.css';
import Card from '../ui/Card';
import { BarChart, LineChart, PieChart } from './';
import clsx from 'clsx';

const DashboardStats = ({
  stats,
  charts,
  period = 'weekly',
  onPeriodChange,
  loading = false,
}) => {
  const periods = ['daily', 'weekly', 'monthly', 'yearly'];

  return (
    <div className={styles.dashboardStats}>
      {/* Period Selector */}
      {onPeriodChange && (
        <div className={styles.periodSelector}>
          {periods.map((p) => (
            <button
              key={p}
              className={clsx(styles.periodButton, period === p && styles.active)}
              onClick={() => onPeriodChange(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index} variant="elevated" padding="medium" className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: stat.color + '20' }}>
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <div className={styles.statContent}>
                <h4 className={styles.statLabel}>{stat.label}</h4>
                <p className={styles.statValue}>{stat.value}</p>
                {stat.trend && (
                  <span className={clsx(
                    styles.statTrend,
                    stat.trend > 0 ? styles.up : styles.down
                  )}>
                    {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      {charts && (
        <div className={styles.chartsGrid}>
          {charts.map((chart, index) => (
            <Card key={index} variant="elevated" className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>{chart.title}</h3>
                {chart.actions && (
                  <div className={styles.chartActions}>
                    {chart.actions}
                  </div>
                )}
              </div>
              <div className={styles.chartBody}>
                {chart.type === 'bar' && (
                  <BarChart
                    data={chart.data}
                    xKey={chart.xKey}
                    yKey={chart.yKey}
                    height={chart.height || 300}
                    {...chart.options}
                  />
                )}
                {chart.type === 'line' && (
                  <LineChart
                    data={chart.data}
                    xKey={chart.xKey}
                    yKey={chart.yKey}
                    height={chart.height || 300}
                    {...chart.options}
                  />
                )}
                {chart.type === 'pie' && (
                  <PieChart
                    data={chart.data}
                    nameKey={chart.nameKey}
                    valueKey={chart.valueKey}
                    height={chart.height || 300}
                    {...chart.options}
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardStats;
