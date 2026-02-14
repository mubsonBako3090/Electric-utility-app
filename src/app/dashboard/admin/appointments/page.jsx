'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppointments } from '@/hooks/useAppointments';
import StatusBadge from '@/components/common/StatusBadge';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import Button from '@/components/ui/Button';
import styles from './appointments.module.css';

export default function AppointmentsPage() {
  const router = useRouter();
  const {
    appointments,
    loading,
    pagination,
    fetchAppointments,
    updateAppointment
  } = useAppointments();

  const [filters, setFilters] = useState({
    status: 'all',
    date: '',
    doctor: '',
    patient: ''
  });

  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    fetchAppointments(filters);
  }, [filters]);

  const handleSearch = (term) => {
    setFilters(prev => ({ ...prev, search: term }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    const result = await updateAppointment(appointmentId, { status: newStatus });
    if (result.success) {
      fetchAppointments(filters);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Appointments' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Appointments</h1>
          <p className={styles.pageSubtitle}>Manage and schedule patient appointments</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.activeView : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋 List
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'calendar' ? styles.activeView : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              📅 Calendar
            </button>
          </div>
          <Link href="/admin/appointments/new" className={styles.addButton}>
            + New Appointment
          </Link>
        </div>
      </div>

      <div className={styles.controls}>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search appointments by patient or doctor..."
          className={styles.searchBar}
        />

        <div className={styles.filters}>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={styles.filterSelect}
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            className={styles.dateInput}
          />

          <Button variant="secondary" size="small">
            More Filters
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
          <div className={styles.appointmentsList}>
            <table className={styles.appointmentsTable}>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.dateTime}>
                        <span className={styles.date}>{appointment.date}</span>
                        <span className={styles.time}>{appointment.startTime}</span>
                      </div>
                    </td>
                    <td>
                      <Link href={`/admin/patients/${appointment.patientId}`} className={styles.patientLink}>
                        {appointment.patientName}
                      </Link>
                    </td>
                    <td>
                      <Link href={`/admin/doctors/${appointment.doctorId}`} className={styles.doctorLink}>
                        Dr. {appointment.doctorName}
                      </Link>
                    </td>
                    <td>
                      <span className={styles.appointmentType}>{appointment.type}</span>
                    </td>
                    <td>
                      <StatusBadge status={appointment.status} />
                    </td>
                    <td>
                      <StatusBadge status={appointment.paymentStatus || 'pending'} />
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <Link
                          href={`/admin/appointments/${appointment.id}`}
                          className={styles.actionBtn}
                          title="View Details"
                        >
                          👁️
                        </Link>
                        <button
                          className={styles.actionBtn}
                          title="Reschedule"
                          onClick={() => router.push(`/admin/appointments/${appointment.id}/reschedule`
