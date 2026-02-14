'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './doctors.module.css';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('all');

  useEffect(() => {
    fetchDoctors();
  }, [searchTerm, specialization]);

  const fetchDoctors = async () => {
    try {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        specialization
      });
      const response = await fetch(`/api/admin/doctors?${queryParams}`);
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityStatus = (doctor) => {
    const today = new Date().toLocaleString('en-us', { weekday: 'long' });
    const todaySchedule = doctor.availability?.find(a => a.day === today);
    return todaySchedule?.isAvailable ? 'Available' : 'Unavailable';
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Doctor Management</h1>
          <p className={styles.pageSubtitle}>Manage doctors and their schedules</p>
        </div>
        <Link href="/admin/doctors/new" className={styles.addButton}>
          + Add New Doctor
        </Link>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search doctors by name, specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Specializations</option>
          <option value="cardiology">Cardiology</option>
          <option value="neurology">Neurology</option>
          <option value="pediatrics">Pediatrics</option>
          <option value="orthopedics">Orthopedics</option>
          <option value="dermatology">Dermatology</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <div className={styles.doctorsGrid}>
          {doctors.map((doctor) => (
            <div key={doctor.id} className={styles.doctorCard}>
              <div className={styles.cardHeader}>
                <Image
                  src={doctor.image || '/images/default-avatar.png'}
                  alt={doctor.name}
                  width={80}
                  height={80}
                  className={styles.doctorImage}
                />
                <div className={styles.doctorInfo}>
                  <h3 className={styles.doctorName}>{doctor.name}</h3>
                  <p className={styles.doctorSpecialization}>{doctor.specialization}</p>
                  <span className={`${styles.availability} ${styles[getAvailabilityStatus(doctor)]}`}>
                    {getAvailabilityStatus(doctor)}
                  </span>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>License:</span>
                  <span className={styles.infoValue}>{doctor.licenseNumber}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Experience:</span>
                  <span className={styles.infoValue}>{doctor.experience} years</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Department:</span>
                  <span className={styles.infoValue}>{doctor.department}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Consultation Fee:</span>
                  <span className={styles.infoValue}>${doctor.consultationFee}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Rating:</span>
                  <span className={styles.infoValue}>
                    {'★'.repeat(Math.floor(doctor.rating))}
                    {'☆'.repeat(5 - Math.floor(doctor.rating))}
                    <span className={styles.ratingValue}> ({doctor.totalReviews})</span>
                  </span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{doctor.totalPatients}</span>
                    <span className={styles.statLabel}>Patients</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{doctor.todayAppointments}</span>
                    <span className={styles.statLabel}>Today</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{doctor.upcomingAppointments}</span>
                    <span className={styles.statLabel}>Upcoming</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <Link href={`/admin/doctors/${doctor.id}`} className={styles.actionBtn}>
                    View
                  </Link>
                  <Link href={`/admin/doctors/${doctor.id}/edit`} className={styles.actionBtn}>
                    Edit
                  </Link>
                  <Link href={`/admin/doctors/${doctor.id}/schedule`} className={styles.actionBtn}>
                    Schedule
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
