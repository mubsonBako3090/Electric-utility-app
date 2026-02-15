'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './RecentPatients.module.css';

export default function RecentPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPatients();
  }, []);

  const fetchRecentPatients = async () => {
    try {
      const response = await fetch('/api/patients/recent');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statuses = {
      active: styles.statusActive,
      discharged: styles.statusDischarged,
      critical: styles.statusCritical,
      stable: styles.statusStable
    };
    return statuses[status] || styles.statusActive;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Patients</h3>
        <Link href="/admin/patients" className={styles.viewAllLink}>
          View All →
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>ID</th>
              <th>Age/Gender</th>
              <th>Department</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className={styles.tableRow}>
                <td>
                  <div className={styles.patientInfo}>
                    <Image 
                      src={patient.image || '/images/default-avatar.png'}
                      alt={patient.name}
                      width={40}
                      height={40}
                      className={styles.patientImage}
                    />
                    <div>
                      <div className={styles.patientName}>{patient.name}</div>
                      <div className={styles.patientEmail}>{patient.email}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.patientId}>#{patient.id.slice(-6)}</td>
                <td>{patient.age}/{patient.gender}</td>
                <td>{patient.department}</td>
                <td>{patient.doctorName}</td>
                <td>
                  <span className={`${styles.status} ${getStatusClass(patient.status)}`}>
                    {patient.status}
                  </span>
                </td>
                <td>{patient.lastVisit}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} title="View Profile">👁️</button>
                    <button className={styles.actionBtn} title="Edit">✏️</button>
                    <button className={styles.actionBtn} title="Message">💬</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {patients.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <p>No patients found</p>
        </div>
      )}
    </div>
  );
      }
