'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useAppointments } from '@/hooks/useAppointments';
import { useBilling } from '@/hooks/useBilling';
import StatusBadge from '@/components/common/StatusBadge';
import styles from './dashboard.module.css';

export default function PatientDashboard() {
  const { data: session } = useSession();
  const { appointments, loading: appointmentsLoading, fetchAppointments } = useAppointments();
  const { invoices, loading: billingLoading, stats, fetchInvoices } = useBilling();
  
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchAppointments({ patientId: session.user.id });
      fetchInvoices({ patientId: session.user.id });
    }
  }, [session?.user?.id]);

  useEffect(() => {
    // Filter upcoming appointments
    const upcoming = appointments
      .filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed')
      .slice(0, 3);
    setUpcomingAppointments(upcoming);

    // Get recent invoices
    setRecentInvoices(invoices.slice(0, 3));
  }, [appointments, invoices]);

  const quickActions = [
    { icon: '📅', label: 'Book Appointment', link: '/patient/appointments/new', color: '#667eea' },
    { icon: '💰', label: 'Pay Bills', link: '/patient/billing', color: '#48bb78' },
    { icon: '📋', label: 'View Records', link: '/patient/medical-records', color: '#ecc94b' },
    { icon: '💬', label: 'Message Doctor', link: '/patient/messages', color: '#9f7aea' }
  ];

  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80', status: 'normal', icon: '❤️' },
    { label: 'Heart Rate', value: '72 bpm', status: 'normal', icon: '💓' },
    { label: 'Weight', value: '75 kg', status: 'normal', icon: '⚖️' },
    { label: 'Last Checkup', value: '2 weeks ago', status: 'info', icon: '🏥' }
  ];

  if (appointmentsLoading || billingLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Welcome Header */}
      <div className={styles.welcomeHeader}>
        <div>
          <h1 className={styles.welcomeTitle}>
            Welcome back, <span className={styles.patientName}>{session?.user?.name}</span>
          </h1>
          <p className={styles.welcomeSubtitle}>
            Here's your health summary and upcoming appointments
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.notificationBtn}>
            🔔
            <span className={styles.notificationBadge}>2</span>
          </button>
          <Link href="/patient/profile" className={styles.profileBtn}>
            <Image
              src={session?.user?.image || '/images/default-avatar.png'}
              alt="Profile"
              width={40}
              height={40}
              className={styles.profileImage}
            />
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.link}
            className={styles.quickActionCard}
            style={{ '--action-color': action.color }}
          >
            <span className={styles.quickActionIcon}>{action.icon}</span>
            <span className={styles.quickActionLabel}>{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Health Metrics */}
      <div className={styles.healthMetrics}>
        <h2 className={styles.sectionTitle}>Health Overview</h2>
        <div className={styles.metricsGrid}>
          {healthMetrics.map((metric, index) => (
            <div key={index} className={styles.metricCard}>
              <span className={styles.metricIcon}>{metric.icon}</span>
              <div className={styles.metricInfo}>
                <span className={styles.metricLabel}>{metric.label}</span>
                <span className={styles.metricValue}>{metric.value}</span>
                <StatusBadge status={metric.status} size="small" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Upcoming Appointments */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h3>Upcoming Appointments</h3>
            <Link href="/patient/appointments" className={styles.viewAllLink}>
              View All
            </Link>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className={styles.appointmentsList}>
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className={styles.appointmentItem}>
                  <div className={styles.appointmentDateTime}>
                    <span className={styles.appointmentDate}>{apt.date}</span>
                    <span className={styles.appointmentTime}>{apt.time}</span>
                  </div>
                  <div className={styles.appointmentInfo}>
                    <h4>Dr. {apt.doctorName}</h4>
                    <p>{apt.specialization}</p>
                    <StatusBadge status={apt.status} />
                  </div>
                  <Link 
                    href={`/patient/appointments/${apt.id}`}
                    className={styles.appointmentAction}
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No upcoming appointments</p>
              <Link href="/patient/appointments/new" className={styles.bookBtn}>
                Book Now
              </Link>
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h3>Recent Invoices</h3>
            <Link href="/patient/billing" className={styles.viewAllLink}>
              View All
            </Link>
          </div>

          {recentInvoices.length > 0 ? (
            <div className={styles.invoicesList}>
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className={styles.invoiceItem}>
                  <div className={styles.invoiceInfo}>
                    <span className={styles.invoiceNumber}>#{invoice.number}</span>
                    <span className={styles.invoiceDate}>{invoice.date}</span>
                  </div>
                  <div className={styles.invoiceAmount}>
                    ${invoice.amount.toFixed(2)}
                  </div>
                  <StatusBadge status={invoice.status} />
                  <Link 
                    href={`/patient/billing/${invoice.id}`}
                    className={styles.invoiceAction}
                  >
                    Pay
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No invoices found</p>
            </div>
          )}

          {/* Billing Summary */}
          <div className={styles.billingSummary}>
            <div className={styles.summaryItem}>
              <span>Total Paid</span>
              <strong>${stats.totalPaid?.toFixed(2) || '0.00'}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>Pending</span>
              <strong className={styles.pendingAmount}>
                ${stats.totalPending?.toFixed(2) || '0.00'}
              </strong>
            </div>
          </div>
        </div>

        {/* Medical Records Summary */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h3>Recent Medical Records</h3>
            <Link href="/patient/medical-records" className={styles.viewAllLink}>
              View All
            </Link>
          </div>

          <div className={styles.recordsList}>
            <div className={styles.recordItem}>
              <span className={styles.recordIcon}>📋</span>
              <div className={styles.recordInfo}>
                <h4>Annual Checkup</h4>
                <p>Dr. Smith • Mar 15, 2024</p>
              </div>
              <Link href="/patient/medical-records/1" className={styles.recordAction}>
                View
              </Link>
            </div>
            <div className={styles.recordItem}>
              <span className={styles.recordIcon}>💊</span>
              <div className={styles.recordInfo}>
                <h4>Prescription Refill</h4>
                <p>Dr. Johnson • Mar 10, 2024</p>
              </div>
              <Link href="/patient/medical-records/2" className={styles.recordAction}>
                View
              </Link>
            </div>
            <div className={styles.recordItem}>
              <span className={styles.recordIcon}>🔬</span>
              <div className={styles.recordInfo}>
                <h4>Lab Results</h4>
                <p>Blood Work • Mar 5, 2024</p>
              </div>
              <Link href="/patient/medical-records/3" className={styles.recordAction}>
                View
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className={styles.healthTips}>
        <h3 className={styles.tipsTitle}>💡 Health Tips</h3>
        <div className={styles.tipsCarousel}>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>✅</span>
            <p>Stay hydrated - drink at least 8 glasses of water daily</p>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>✅</span>
            <p>Regular exercise for 30 minutes can boost your immunity</p>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>✅</span>
            <p>Get 7-8 hours of sleep for optimal health</p>
          </div>
        </div>
      </div>
    </div>
  );
    }
