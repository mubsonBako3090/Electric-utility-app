'use client';

import { useState } from 'react';
import styles from './AppointmentCalendar.module.css';

export default function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([
    { time: '09:00', patient: 'John Doe', doctor: 'Dr. Smith', type: 'Checkup', status: 'confirmed' },
    { time: '10:30', patient: 'Jane Smith', doctor: 'Dr. Johnson', type: 'Follow-up', status: 'pending' },
    { time: '11:00', patient: 'Bob Wilson', doctor: 'Dr. Smith', type: 'Consultation', status: 'confirmed' },
    { time: '14:00', patient: 'Alice Brown', doctor: 'Dr. Williams', type: 'Emergency', status: 'in-progress' },
    { time: '15:30', patient: 'Charlie Davis', doctor: 'Dr. Johnson', type: 'Checkup', status: 'confirmed' },
  ]);

  const getStatusClass = (status) => {
    const statuses = {
      confirmed: styles.statusConfirmed,
      pending: styles.statusPending,
      'in-progress': styles.statusInProgress,
      cancelled: styles.statusCancelled
    };
    return statuses[status] || '';
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: '✅',
      pending: '⏳',
      'in-progress': '⚕️',
      cancelled: '❌'
    };
    return icons[status] || '📅';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Today's Appointments</h3>
          <p className={styles.date}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <button className={styles.addBtn}>+ New Appointment</button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>12</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>8</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>3</span>
          <span className={styles.statLabel}>Pending</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>1</span>
          <span className={styles.statLabel}>In Progress</span>
        </div>
      </div>

      <div className={styles.timeline}>
        {appointments.map((apt, index) => (
          <div key={index} className={styles.timelineItem}>
            <div className={styles.timeColumn}>
              <span className={styles.time}>{apt.time}</span>
            </div>
            
            <div className={styles.appointmentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.patientInfo}>
                  <span className={styles.patientName}>{apt.patient}</span>
                  <span className={styles.appointmentType}>{apt.type}</span>
                </div>
                <span className={`${styles.status} ${getStatusClass(apt.status)}`}>
                  {getStatusIcon(apt.status)} {apt.status}
                </span>
              </div>
              
              <div className={styles.cardBody}>
                <div className={styles.doctorInfo}>
                  <span className={styles.doctorLabel}>Doctor:</span>
                  <span className={styles.doctorName}>{apt.doctor}</span>
                </div>
              </div>
              
              <div className={styles.cardFooter}>
                <button className={styles.actionBtn} title="Start Consultation">▶️ Start</button>
                <button className={styles.actionBtn} title="Reschedule">📅 Reschedule</button>
                <button className={styles.actionBtn} title="Cancel">❌ Cancel</button>
                <button className={styles.actionBtn} title="View Details">👁️ Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
    }
