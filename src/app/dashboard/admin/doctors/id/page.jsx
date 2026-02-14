'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import StatusBadge from '@/components/common/StatusBadge';
import Button from '@/components/ui/Button';
import styles from './doctor-detail.module.css';

export default function DoctorDetailPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorData();
  }, [id]);

  const fetchDoctorData = async () => {
    try {
      const [doctorRes, appointmentsRes] = await Promise.all([
        fetch(`/api/admin/doctors/${id}`),
        fetch(`/api/admin/doctors/${id}/appointments`)
      ]);

      const doctorData = await doctorRes.json();
      const appointmentsData = await appointmentsRes.json();

      setDoctor(doctorData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
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

  if (!doctor) {
    return (
      <div className={styles.errorContainer}>
        <h2>Doctor not found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back to Doctors
        </button>
        <div className={styles.headerActions}>
          <Link href={`/admin/doctors/${id}/edit`} className={styles.editBtn}>
            ✏️ Edit Doctor
          </Link>
          <Link href={`/admin/doctors/${id}/schedule`} className={styles.scheduleBtn}>
            📅 Manage Schedule
          </Link>
        </div>
      </div>

      {/* Doctor Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImageWrapper}>
            <Image
              src={doctor.image || '/images/default-avatar.png'}
              alt={doctor.name}
              width={150}
              height={150}
              className={styles.profileImage}
            />
          </div>
          
          <div className={styles.profileInfo}>
            <h1 className={styles.doctorName}>Dr. {doctor.name}</h1>
            <p className={styles.doctorSpecialization}>{doctor.specialization}</p>
            <div className={styles.qualifications}>
              {doctor.qualifications?.map((qual, index) => (
                <span key={index} className={styles.qualification}>{qual}</span>
              ))}
            </div>
            <div className={styles.statusWrapper}>
              <StatusBadge status={doctor.status || 'active'} />
            </div>
          </div>

          <div className={styles.quickStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{doctor.experience}</span>
              <span className={styles.statLabel}>Years Exp</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{doctor.totalPatients}</span>
              <span className={styles.statLabel}>Patients</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>${doctor.consultationFee}</span>
              <span className={styles.statLabel}>Fee</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{doctor.rating}★</span>
              <span className={styles.statLabel}>Rating</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'schedule' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            Schedule
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'appointments' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments ({appointments.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'patients' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            Patients
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <OverviewTab doctor={doctor} />
          )}
          {activeTab === 'schedule' && (
            <ScheduleTab doctorId={id} schedule={doctor.availability} />
          )}
          {activeTab === 'appointments' && (
            <AppointmentsTab appointments={appointments} doctorId={id} />
          )}
          {activeTab === 'patients' && (
            <PatientsTab doctorId={id} />
          )}
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ doctor }) {
  return (
    <div className={styles.overviewTab}>
      <div className={styles.infoGrid}>
        <div className={styles.infoSection}>
          <h3>Contact Information</h3>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Email:</span>
            <span className={styles.infoValue}>{doctor.email}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Phone:</span>
            <span className={styles.infoValue}>{doctor.phone}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>License #:</span>
            <span className={styles.infoValue}>{doctor.licenseNumber}</span>
          </div>
        </div>

        <div className={styles.infoSection}>
          <h3>Professional Information</h3>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Department:</span>
            <span className={styles.infoValue}>{doctor.department}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Joined:</span>
            <span className={styles.infoValue}>{doctor.joinedDate}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Education:</span>
            <span className={styles.infoValue}>{doctor.education}</span>
          </div>
        </div>

        <div className={styles.infoSection}>
          <h3>Statistics</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statCardValue}>{doctor.totalAppointments}</span>
              <span className={styles.statCardLabel}>Total Appointments</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statCardValue}>{doctor.completedAppointments}</span>
              <span className={styles.statCardLabel}>Completed</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statCardValue}>{doctor.cancelledAppointments}</span>
              <span className={styles.statCardLabel}>Cancelled</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bioSection}>
        <h3>Biography</h3>
        <p>{doctor.bio || 'No biography provided.'}</p>
      </div>
    </div>
  );
}

// Schedule Tab Component
function ScheduleTab({ doctorId, schedule }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className={styles.scheduleTab}>
      <div className={styles.scheduleHeader}>
        <h3>Weekly Schedule</h3>
        <Link href={`/admin/doctors/${doctorId}/schedule/edit`} className={styles.editScheduleBtn}>
          Edit Schedule
        </Link>
      </div>

      <div className={styles.scheduleGrid}>
        {days.map(day => {
          const daySchedule = schedule?.find(s => s.day === day) || {};
          return (
            <div key={day} className={styles.scheduleDay}>
              <div className={styles.dayHeader}>
                <h4>{day}</h4>
                {daySchedule.isAvailable ? (
                  <StatusBadge status="available" />
                ) : (
                  <StatusBadge status="unavailable" />
                )}
              </div>
              {daySchedule.isAvailable ? (
                <div className={styles.timeSlot}>
                  <span>{daySchedule.startTime || '09:00'}</span>
                  <span> - </span>
                  <span>{daySchedule.endTime || '17:00'}</span>
                </div>
              ) : (
                <p className={styles.notAvailable}>Not Available</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Appointments Tab Component
function AppointmentsTab({ appointments, doctorId }) {
  return (
    <div className={styles.appointmentsTab}>
      <div className={styles.appointmentsHeader}>
        <h3>Upcoming Appointments</h3>
        <Link href={`/admin/appointments/new?doctorId=${doctorId}`} className={styles.newAppointmentBtn}>
          + New Appointment
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.appointmentsTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Patient</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td>{apt.date}</td>
                <td>{apt.time}</td>
                <td>{apt.patientName}</td>
                <td>{apt.type}</td>
                <td>
                  <StatusBadge status={apt.status} />
                </td>
                <td>
                  <Link href={`/admin/appointments/${apt.id}`} className={styles.actionLink}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Patients Tab Component
function PatientsTab({ doctorId }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, [doctorId]);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`/api/admin/doctors/${doctorId}/patients`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.patientsTab}>
      <h3>Current Patients</h3>
      <div className={styles.patientsGrid}>
        {patients.map((patient) => (
          <Link key={patient.id} href={`/admin/patients/${patient.id}`} className={styles.patientCard}>
            <Image
              src={patient.image || '/images/default-avatar.png'}
              alt={patient.name}
              width={60}
              height={60}
              className={styles.patientImage}
            />
            <div className={styles.patientInfo}>
              <h4>{patient.name}</h4>
              <p>Last Visit: {patient.lastVisit}</p>
              <StatusBadge status={patient.status} size="small" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
        }
