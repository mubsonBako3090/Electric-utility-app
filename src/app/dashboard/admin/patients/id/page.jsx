'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './patient-detail.module.css';

export default function PatientDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const fetchPatientDetails = async () => {
    try {
      const response = await fetch(`/api/admin/patients/${id}`);
      const data = await response.json();
      setPatient(data);
    } catch (error) {
      console.error('Error fetching patient:', error);
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

  if (!patient) {
    return (
      <div className={styles.errorContainer}>
        <h2>Patient not found</h2>
        <button onClick={() => router.back()} className={styles.backButton}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back to Patients
        </button>
        <div className={styles.headerActions}>
          <Link href={`/admin/patients/${id}/edit`} className={styles.editBtn}>
            ✏️ Edit Patient
          </Link>
          <button className={styles.messageBtn}>💬 Message</button>
          <button className={styles.appointmentBtn}>📅 New Appointment</button>
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <Image
            src={patient.image || '/images/default-avatar.png'}
            alt={patient.name}
            width={120}
            height={120}
            className={styles.profileImage}
          />
          <div className={styles.profileInfo}>
            <h1 className={styles.patientName}>{patient.name}</h1>
            <p className={styles.patientId}>Patient ID: {patient.patientId}</p>
            <div className={styles.statusBadge}>
              <span className={`${styles.status} ${styles[patient.status]}`}>
                {patient.status}
              </span>
            </div>
          </div>
          <div className={styles.quickStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{patient.age}</span>
              <span className={styles.statLabel}>Years</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{patient.bloodGroup}</span>
              <span className={styles.statLabel}>Blood Type</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{patient.gender}</span>
              <span className={styles.statLabel}>Gender</span>
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
            className={`${styles.tab} ${activeTab === 'medical' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('medical')}
          >
            Medical History
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'appointments' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'billing' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            Billing
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'documents' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overviewTab}>
              <div className={styles.infoGrid}>
                <div className={styles.infoSection}>
                  <h3>Contact Information</h3>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email:</span>
                    <span className={styles.infoValue}>{patient.email}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Phone:</span>
                    <span className={styles.infoValue}>{patient.phone}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Address:</span>
                    <span className={styles.infoValue}>{patient.address}</span>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h3>Emergency Contact</h3>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Name:</span>
                    <span className={styles.infoValue}>{patient.emergencyContact.name}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Relationship:</span>
                    <span className={styles.infoValue}>{patient.emergencyContact.relationship}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Phone:</span>
                    <span className={styles.infoValue}>{patient.emergencyContact.phone}</span>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h3>Insurance Information</h3>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Provider:</span>
                    <span className={styles.infoValue}>{patient.insurance.provider}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Policy #:</span>
                    <span className={styles.infoValue}>{patient.insurance.policyNumber}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Expiry:</span>
                    <span className={styles.infoValue}>{patient.insurance.expiryDate}</span>
                  </div>
                </div>
              </div>

              <div className={styles.recentActivity}>
                <h3>Recent Activity</h3>
                <div className={styles.activityList}>
                  {patient.recentActivities?.map((activity, index) => (
                    <div key={index} className={styles.activityItem}>
                      <span className={styles.activityIcon}>{activity.icon}</span>
                      <div className={styles.activityDetails}>
                        <p>{activity.description}</p>
                        <span className={styles.activityTime}>{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className={styles.medicalTab}>
              <div className={styles.medicalHeader}>
                <h3>Medical History</h3>
                <button className={styles.addRecordBtn}>+ Add Medical Record</button>
              </div>
              
              <div className={styles.medicalRecords}>
                {patient.medicalRecords?.map((record, index) => (
                  <div key={index} className={styles.medicalRecord}>
                    <div className={styles.recordHeader}>
                      <span className={styles.recordDate}>{record.date}</span>
                      <span className={styles.recordDoctor}>Dr. {record.doctor}</span>
                    </div>
                    <div className={styles.recordDiagnosis}>
                      <strong>Diagnosis:</strong> {record.diagnosis}
                    </div>
                    <div className={styles.recordPrescription}>
                      <strong>Prescription:</strong> {record.prescription}
                    </div>
                    <div className={styles.recordNotes}>
                      <strong>Notes:</strong> {record.notes}
                    </div>
                    <div className={styles.recordActions}>
                      <button className={styles.viewBtn}>View Details</button>
                      <button className={styles.downloadBtn}>Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className={styles.appointmentsTab}>
              <div className={styles.appointmentsHeader}>
                <h3>Appointment History</h3>
                <button className={styles.scheduleBtn}>Schedule New</button>
              </div>
              
              <table className={styles.appointmentsTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.appointments?.map((apt, index) => (
                    <tr key={index}>
                      <td>{apt.date}</td>
                      <td>{apt.time}</td>
                      <td>Dr. {apt.doctor}</td>
                      <td>{apt.department}</td>
                      <td>{apt.type}</td>
                      <td>
                        <span className={`${styles.appointmentStatus} ${styles[apt.status]}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        <button className={styles.viewBtn}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className={styles.billingTab}>
              <div className={styles.billingHeader}>
                <h3>Billing Summary</h3>
                <button className={styles.newInvoiceBtn}>Create Invoice</button>
              </div>
              
              <div className={styles.billingStats}>
                <div className={styles.billingStat}>
                  <span className={styles.statLabel}>Total Billed</span>
                  <span className={styles.statAmount}>${patient.billing?.totalBilled}</span>
                </div>
                <div className={styles.billingStat}>
                  <span className={styles.statLabel}>Paid</span>
                  <span className={styles.statAmount}>${patient.billing?.paid}</span>
                </div>
                <div className={styles.billingStat}>
                  <span className={styles.statLabel}>Pending</span>
                  <span className={styles.statAmount}>${patient.billing?.pending}</span>
                </div>
                <div className={styles.billingStat}>
                  <span className={styles.statLabel}>Insurance</span>
                  <span className={styles.statAmount}>${patient.billing?.insurance}</span>
                </div>
              </div>

              <table className={styles.invoicesTable}>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.invoices?.map((invoice, index) => (
                    <tr key={index}>
                      <td>{invoice.number}</td>
                      <td>{invoice.date}</td>
                      <td>{invoice.description}</td>
                      <td>${invoice.amount}</td>
                      <td>
                        <span className={`${styles.invoiceStatus} ${styles[invoice.status]}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td>
                        <button className={styles.viewBtn}>View</button>
                        <button className={styles.downloadBtn}>PDF</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
        }
