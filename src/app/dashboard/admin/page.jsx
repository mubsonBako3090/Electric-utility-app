'use client';

import { useState, useEffect } from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentPatients from '@/components/dashboard/RecentPatients';
import AppointmentCalendar from '@/components/dashboard/AppointmentCalendar';
import RevenueChart from '@/components/dashboard/RevenueChart';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    pendingBills: 0,
    occupancyRate: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Admin Dashboard</h1>
        <p className={styles.pageSubtitle}>Welcome back! Here's what's happening today.</p>
      </div>

      <div className={styles.statsGrid}>
        <StatsCard 
          title="Total Patients"
          value={stats.totalPatients}
          icon="👥"
          trend="+12%"
          color="primary"
        />
        <StatsCard 
          title="Total Doctors"
          value={stats.totalDoctors}
          icon="👨‍⚕️"
          trend="+2"
          color="success"
        />
        <StatsCard 
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon="📅"
          trend="8 remaining"
          color="warning"
        />
        <StatsCard 
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon="💰"
          trend="+15%"
          color="secondary"
        />
        <StatsCard 
          title="Pending Bills"
          value={stats.pendingBills}
          icon="💳"
          trend="5 overdue"
          color="danger"
        />
        <StatsCard 
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon="🏥"
          trend="+5%"
          color="info"
        />
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.gridItemLarge}>
          <RevenueChart />
        </div>
        <div className={styles.gridItem}>
          <AppointmentCalendar />
        </div>
        <div className={styles.gridItemFull}>
          <RecentPatients />
        </div>
      </div>
    </div>
  );
}
