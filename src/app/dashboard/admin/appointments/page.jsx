'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/hooks/useAuth';
import StatusBadge from '@/components/common/StatusBadge';
import styles from './appointments.module.css';

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    appointments,
    loading,
    fetchAppointments,
    updateAppointment
  } = useAppointments();

  const [filter, setFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchAppointments({ 
        doctorId: user.id,
        filter: filter 
      });
    }
  }, [user?.id, filter]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    const result = await updateAppointment(appointmentId, { status: newStatus });
    if (result.success) {
      fetchAppointments({ doctorId: user.id, filter });
    }
  };

  const startConsultation = (appointmentId) => {
    router.push(`/doctor/appointments/${appointmentId}/consultation`);
  };

  const filterOptions = [
    { value: 'today', label: "Today's Appointments" },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Appointments</h1>
        <p className={styles.pageSubtitle}>Manage your patient appointments</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.filterTabs}>
          {filterOptions.map(option => (
            <button
              key={option.value}
              className={`${styles.filterTab} ${filter === option.value ? styles.activeFilter : ''}`}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.appointmentsList}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
          </div>
        ) : (
          <>
            {appointments.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📅</div>
                <h3>No appointments found</h3>
                <p>You have no {filter} appointments</p>
              </div>
            ) : (
              <div className={styles.timeline}>
                {appointments.map((appointment) => (
                  <div key={appointment.id} className={styles.appointmentCard}>
                    <div className={styles.timeColumn}>
                      <span className={styles.time}>{appointment.startTime}</span>
                      <span className={styles.duration}>{appointment.duration} min</span>
                    </div>

                    <div className={styles.appointmentContent}>
                      <div className={styles.cardHeader}>
                        <div className={styles.patientInfo}>
                          <h3>{appointment.patientName}</h3>
                          <span className={styles.appointmentType}>{appointment.type}</span>
                        </div>
                        <StatusBadge status={appointment.status} />
                      </div>

                      <div className={styles.cardBody}>
                        <p className={styles.reason}>
                          <strong>Reason:</strong> {appointment.reason}
                        </p>
                        {appointment.notes && (
                          <p className={styles.notes}>
                            <strong>Notes:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>

                      <div className={styles.cardFooter}>
                        <Link 
                          href={`/doctor/patients/${appointment.patientId}`}
                          className={styles.viewPatientBtn}
                        >
                          View Patient
                        </Link>

                        {appointment.status === 'scheduled' && (
                          <button
                            className={styles.startBtn}
                            onClick={() => startConsultation(appointment.id)}
                          >
                            Start Consultation
                          </button>
                        )}

                        {appointment.status === 'in-progress' && (
                          <button
                            className={styles.completeBtn}
                            onClick={() => handleStatusChange(appointment.id, 'completed')}
                          >
                            Complete
                          </button>
                        )}

                        {appointment.status === 'scheduled' && (
                          <select
                            className={styles.statusSelect}
                            value={appointment.status}
                            onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="confirmed">Confirm</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
              }
