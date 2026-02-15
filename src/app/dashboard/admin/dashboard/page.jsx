'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useAppointments } from '@/hooks/useAppointments';
import { usePatients } from '@/hooks/usePatients';
import { useBilling } from '@/hooks/useBilling';
import StatusBadge from '@/components/common/StatusBadge';
import styles from './dashboard.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const { appointments, loading: aptLoading, fetchAppointments } = useAppointments();
  const { patients, loading: patientLoading, fetchPatients } = usePatients();
  const { invoices, loading: billLoading, stats, fetchInvoices } = useBilling();

  const [timeframe, setTimeframe] = useState('week');
  const [revenueData, setRevenueData] = useState({});
  const [departmentData, setDepartmentData] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    await Promise.all([
      fetchAppointments({ limit: 100 }),
      fetchPatients({ limit: 100 }),
      fetchInvoices({ limit: 100 })
    ]);

    generateCharts();
    generateActivities();
  };

  const generateCharts = () => {
    // Revenue Chart Data
    const labels = timeframe === 'week' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    const revenueValues = timeframe === 'week'
      ? [4500, 5200, 4800, 5800, 6000, 4200, 3800]
      : [18500, 21000, 19800, 22500];

    setRevenueData({
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: revenueValues,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    });

    // Department Distribution
    setDepartmentData({
      labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General'],
      datasets: [
        {
          data: [30, 20, 25, 15, 10],
          backgroundColor: [
            '#667eea',
            '#48bb78',
            '#ecc94b',
            '#f56565',
            '#9f7aea'
          ]
        }
      ]
    });
  };

  const generateActivities = () => {
    setRecentActivities([
      { type: 'appointment', description: 'New appointment scheduled', time: '5 min ago', icon: '📅' },
      { type: 'patient', description: 'New patient registered', time: '15 min ago', icon: '👤' },
      { type: 'payment', description: 'Payment received', time: '25 min ago', icon: '💰' },
      { type: 'record', description: 'Medical record updated', time: '45 min ago', icon: '📋' }
    ]);
  };

  const metrics = [
    {
      title: 'Total Patients',
      value: patients.length,
      change: '+12%',
      icon: '👥',
      color: '#667eea'
    },
    {
      title: 'Total Doctors',
      value: 45,
      change: '+2',
      icon: '👨‍⚕️',
      color: '#48bb78'
    },
    {
      title: 'Today\'s Appointments',
      value: appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length,
      change: '+5',
      icon: '📅',
      color: '#ecc94b'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.totalRevenue?.toFixed(2) || '0.00'}`,
      change: '+15%',
      icon: '💰',
      color: '#9f7aea'
    },
    {
      title: 'Pending Bills',
      value: invoices.filter(inv => inv.status === 'pending').length,
      change: '3 overdue',
      icon: '💳',
      color: '#f56565'
    },
    {
      title: 'Bed Occupancy',
      value: '78%',
      change: '+5%',
      icon: '🏥',
      color: '#4299e1'
    }
  ];

  if (aptLoading || patientLoading || billLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className={styles.headerActions}>
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className={styles.timeframeSelect}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <Link href="/admin/reports" className={styles.reportBtn}>
            📊 Generate Report
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <div key={index} className={styles.metricCard}>
            <div className={styles.metricIcon} style={{ background: metric.color }}>
              {metric.icon}
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>{metric.title}</span>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricChange}>{metric.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Revenue Overview</h3>
            <div className={styles.chartLegend}>
              <span>📈 Revenue</span>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <Line 
              data={revenueData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                }
              }}
            />
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Department Distribution</h3>
          </div>
          <div className={styles.chartContainer}>
            <Doughnut 
              data={departmentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className={styles.tablesGrid}>
        {/* Recent Appointments */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3>Recent Appointments</h3>
            <Link href="/admin/appointments" className={styles.viewAll}>
              View All
            </Link>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map(apt => (
                  <tr key={apt.id}>
                    <td>{apt.patientName}</td>
                    <td>Dr. {apt.doctorName}</td>
                    <td>{apt.date}</td>
                    <td>{apt.startTime}</td>
                    <td><StatusBadge status={apt.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3>Recent Invoices</h3>
            <Link href="/admin/billing" className={styles.viewAll}>
              View All
            </Link>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Patient</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 5).map(inv => (
                  <tr key={inv.id}>
                    <td>#{inv.number}</td>
                    <td>{inv.patientName}</td>
                    <td>${inv.amount}</td>
                    <td>{inv.date}</td>
                    <td><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className={styles.activitiesCard}>
          <h3>Recent Activities</h3>
          <div className={styles.activitiesList}>
            {recentActivities.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <span className={styles.activityIcon}>{activity.icon}</span>
                <div className={styles.activityContent}>
                  <p>{activity.description}</p>
                  <span className={styles.activityTime}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        <div className={styles.actionGrid}>
          <Link href="/admin/patients/new" className={styles.actionButton}>
            <span className={styles.actionIcon}>👤</span>
            <span>Add Patient</span>
          </Link>
          <Link href="/admin/doctors/new" className={styles.actionButton}>
            <span className={styles.actionIcon}>👨‍⚕️</span>
            <span>Add Doctor</span>
          </Link>
          <Link href="/admin/appointments/new" className={styles.actionButton}>
            <span className={styles.actionIcon}>📅</span>
            <span>Schedule</span>
          </Link>
          <Link href="/admin/billing/invoices/new" className={styles.actionButton}>
            <span className={styles.actionIcon}>💰</span>
            <span>Create Invoice</span>
          </Link>
          <Link href="/admin/reports/generate" className={styles.actionButton}>
            <span className={styles.actionIcon}>📊</span>
            <span>Generate Report</span>
          </Link>
          <Link href="/admin/settings" className={styles.actionButton}>
            <span className={styles.actionIcon}>⚙️</span>
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
         }
