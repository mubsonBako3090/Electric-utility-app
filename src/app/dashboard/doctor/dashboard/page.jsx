'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useAppointments } from '@/hooks/useAppointments';
import { usePatients } from '@/hooks/usePatients';
import StatusBadge from '@/components/common/StatusBadge';
import styles from './dashboard.module.css';

export default function DoctorDashboard() {
  const { data: session } = useSession();
  const { appointments, loading: aptLoading, fetchAppointments, updateAppointment } = useAppointments();
  const { patients, loading: patientLoading, fetchPatients } = usePatients();

  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    completedToday: 0,
    pendingAppointments: 0
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchDoctorData();
    }
  }, [session?.user?.id]);

  const fetchDoctorData = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    await Promise.all([
      fetchAppointments({ doctorId: session.user.id, date: today }),
      fetchAppointments({ doctorId: session.user.id, status: 'scheduled,confirmed' }),
      fetchPatients({ doctorId: session.user.id, limit: 5 })
    ]);

    // Filter today's appointments
    const today = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]);
    setTodayAppointments(today);

    // Get upcoming appointments
    const upcoming = appointments.filter(apt => 
      (apt.status === 'scheduled' || apt.status === 'confirmed') && 
      new Date(apt.date) > new Date()
    ).slice(0, 5);
    setUpcomingAppointments(upcoming);

    // Get recent patients
    setRecentPatients(patients.slice(0, 5));

    // Calculate stats
    setStats({
      totalPatients: patients.length,
      todayAppointments: today.length,
      completedToday: today.filter(apt => apt.status === 'completed').length,
      pendingAppointments: appointments.filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed').length
    });
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    await updateAppointment(appointmentId, { status: newStatus });
    fetchDoctorData();
  };

  const quickStats = [
    { label: 'Total Patients', value: stats.totalPatients, icon: '👥', color: '#667eea' },
    { label: "Today's Appointments", value: stats.todayAppointments, icon: '📅', color: '#48bb78' },
    { label: 'Completed Today', value: stats.completedToday, icon: '✅', color: '#9f7aea' },
    { label: 'Pending', value: stats.pendingAppointments, icon: '⏳', color: '#ecc94b' }
  ];

  if (aptLoading || patientLoading) {
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
            Good {getGreeting()}, <span className={styles.doctorName}>Dr. {session?.user?.name}</span>
          </h1>
          <p className={styles.welcomeSubtitle}>
            Here's your practice overview for today
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/doctor/schedule" className={styles.scheduleBtn}>
            📅 Manage Schedule
          </Link>
          <Link href="/doctor/medical-records/new" className={styles.recordBtn}>
            📝 New Record
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        {quickStats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: stat.color }}>{stat.icon}</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dashboardGrid}>
        {/* Today's Schedule */}
        <div className={styles.scheduleCard}>
          <div className={styles.cardHeader}>
            <h3>Today's Schedule</h3>
            <Link href="/doctor/appointments" className={styles.viewAll}>
              View Full Schedule
            </Link>
          </div>

          <div className={styles.timeline}>
            {todayAppointments.length > 0 ? (
              todayAppointments.map((apt) => (
                <div key={apt.id} className={styles.timelineItem}>
                  <div className={styles.timeColumn}>
                    <span className={styles.time}>{apt.startTime}</span>
                  </div>
                  <div className={styles.appointmentContent}>
                    <div className={styles.patientInfo}>
                      <h4>{apt.patientName}</h4>
                      <p>{apt.type} • {apt.duration} min</p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                  <div className={styles.actions}>
                    {apt.status === 'checked-in' && (
                      <button 
                        className={styles.startBtn}
                        onClick={() => handleStatusChange(apt.id, 'in-progress')}
                      >
                        Start
                      </button>
                    )}
                    {apt.status === 'in-progress' && (
                      <button 
                        className={styles.completeBtn}
                        onClick={() => handleStatusChange(apt.id, 'completed')}
                      >
                        Complete
                      </button>
                    )}
                    <Link href={`/doctor/appointments/${apt.id}`} className={styles.viewBtn}>
                      Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>No appointments scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className={styles.upcomingCard}>
          <div className={styles.cardHeader}>
            <h3>Upcoming Appointments</h3>
            <Link href="/doctor/appointments" className={styles.viewAll}>
              View All
            </Link>
          </div>

          <div className={styles.upcomingList}>
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className={styles.upcomingItem}>
                <div className={styles.upcomingDate}>
                  <span className={styles.dateDay}>{new Date(apt.date).getDate()}</span>
                  <span className={styles.dateMonth}>
                    {new Date(apt.date).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div className={styles.upcomingInfo}>
                  <h4>{apt.patientName}</h4>
                  <p>{apt.startTime} • {apt.type}</p>
                </div>
                <Link href={`/doctor/appointments/${apt.id}`} className={styles.upcomingAction}>
                  →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        <div className={styles.patientsCard}>
          <div className={styles.cardHeader}>
            <h3>Recent Patients</h3>
            <Link href="/doctor/patients" className={styles.viewAll}>
              View All
            </Link>
          </div>

          <div className={styles.patientsList}>
            {recentPatients.map((patient) => (
              <div key={patient.id} className={styles.patientRow}>
                <img src={patient.image || '/images/default-avatar.png'} alt={patient.name} />
                <div className={styles.patientInfo}>
                  <h4>{patient.name}</h4>
                  <p>Last Visit: {patient.lastVisit}</p>
                </div>
                <div className={styles.patientActions}>
                  <Link href={`/doctor/patients/${patient.id}`} className={styles.patientAction}>
                    View
                  </Link>
                  <Link href={`/doctor/medical-records/new?patientId=${patient.id}`} className={styles.patientAction}>
                    Add Record
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActionsCard}>
          <h3>Quick Actions</h3>
          <div className={styles.actionGrid}>
            <Link href="/doctor/medical-records/new" className={styles.actionItem}>
              <span className={styles.actionIcon}>📝</span>
              <span>New Record</span>
            </Link>
            <Link href="/doctor/prescriptions/new" className={styles.actionItem}>
              <span className={styles.actionIcon}>💊</span>
              <span>Prescription</span>
            </Link>
            <Link href="/doctor/patients/search" className={styles.actionItem}>
              <span className={styles.actionIcon}>🔍</span>
              <span>Find Patient</span>
            </Link>
            <Link href="/doctor/schedule" className={styles.actionItem}>
              <span className={styles.actionIcon}>⏰</span>
              <span>Schedule</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className={styles.performanceSection}>
        <h3>Weekly Performance</h3>
        <div className={styles.performanceGrid}>
          <div className={styles.performanceCard}>
            <span className={styles.perfLabel}>Consultations</span>
            <span className={styles.perfValue}>24</span>
            <span className={styles.perfTrend positive}>+12%</span>
          </div>
          <div className={styles.performanceCard}>
            <span className={styles.perfLabel}>Follow-ups</span>
            <span className={styles.perfValue}>8</span>
            <span className={styles.perfTrend positive}>+5%</span>
          </div>
          <div className={styles.performanceCard}>
            <span className={styles.perfLabel}>No-shows</span>
            <span className={styles.perfValue}>2</span>
            <span className={styles.perfTrend negative}>-2%</span>
          </div>
          <div className={styles.performanceCard}>
            <span className={styles.perfLabel}>Avg. Wait Time</span>
            <span className={styles.perfValue}>12min</span>
            <span className={styles.perfTrend negative}>+2min</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
    }
