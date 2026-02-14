'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { usePatients } from '@/hooks/usePatients';
import { useAppointments } from '@/hooks/useAppointments';
import { useBilling } from '@/hooks/useBilling';
import StatusBadge from '@/components/common/StatusBadge';
import Button from '@/components/ui/Button';
import styles from './patient-detail.module.css';

export default function PatientDetailPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { getPatient, loading: patientLoading } = usePatients();
  const { getPatientAppointments } = useAppointments();
  const { getPatientBillingHistory } = useBilling();
  
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [billing, setBilling] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const [patientRes, appointmentsRes, billingRes] = await Promise.all([
        getPatient(id),
        getPatientAppointments(id),
        getPatientBillingHistory(id)
      ]);

      if (patientRes.success) setPatient(patientRes.data);
      if (appointmentsRes.success) setAppointments(appointmentsRes.data);
      if (billingRes.success) setBilling(billingRes.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || patientLoading) {
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
        <Button onClick={() => router.back()}>Go Back</Button>
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
          <Link href={`/admin/appointments/new?patientId=${id}`} className={styles.appointmentBtn}>
            📅 New Appointment
          </Link>
          <Link href={`/admin/billing/invoices/new?patientId=${id}`} className={styles.billingBtn}>
            💰 Create Invoice
          </Link>
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImageWrapper}>
            <Image
              src={patient.image || '/images/default-avatar.png'}
              alt={patient.name}
              width={120}
              height={120}
              className={styles.profileImage}
            />
          </div>
          
          <div className={styles.profileInfo}>
            <h1 className={styles.patientName}>{patient.name}</h1>
            <p className={styles.patientId}>Patient ID: {patient.patientId}</p>
            <div className={styles.statusWrapper}>
              <StatusBadge status={patient.status} size="large" />
            </div>
          </div>

          <div className={styles.quickStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{patient.age}</span>
              <span className={styles.statLabel}>Years</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{patient.bloodGroup || 'N/A'}</span>
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
            Appointments ({appointments.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'billing' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            Billing ({billing.length})
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
            <OverviewTab patient={patient} />
          )}
          {activeTab === 'medical' && (
            <MedicalTab patientId={id} />
          )}
          {activeTab === 'appointments' && (
            <AppointmentsTab appointments={appointments} patientId={id} />
          )}
          {activeTab === 'billing' && (
            <BillingTab billing={billing} patientId={id} />
          )}
          {activeTab === 'documents' && (
            <DocumentsTab patientId={id} />
          )}
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ patient }) {
  return (
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
            <span className={styles.infoValue}>{patient.emergencyContact?.name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Relationship:</span>
            <span className={styles.infoValue}>{patient.emergencyContact?.relationship}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Phone:</span>
            <span className={styles.infoValue}>{patient.emergencyContact?.phone}</span>
          </div>
        </div>

        <div className={styles.infoSection}>
          <h3>Insurance Information</h3>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Provider:</span>
            <span className={styles.infoValue}>{patient.insurance?.provider || 'N/A'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Policy #:</span>
            <span className={styles.infoValue}>{patient.insurance?.policyNumber || 'N/A'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Expiry:</span>
            <span className={styles.infoValue}>{patient.insurance?.expiryDate || 'N/A'}</span>
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
          {(!patient.recentActivities || patient.recentActivities.length === 0) && (
            <p className={styles.noActivity}>No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Medical Tab Component
function MedicalTab({ patientId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicalRecords();
  }, [patientId]);

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch(`/api/patients/${patientId}/medical-records`);
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.medicalTab}>
      <div className={styles.medicalHeader}>
        <h3>Medical History</h3>
        <Link href={`/admin/medical-records/new?patientId=${patientId}`} className={styles.addRecordBtn}>
          + Add Medical Record
        </Link>
      </div>

      <div className={styles.medicalRecords}>
        {records.map((record) => (
          <div key={record.id} className={styles.medicalRecord}>
            <div className={styles.recordHeader}>
              <span className={styles.recordDate}>{record.date}</span>
              <span className={styles.recordDoctor}>Dr. {record.doctor}</span>
              <StatusBadge status={record.type} size="small" />
            </div>
            <div className={styles.recordDiagnosis}>
              <strong>Diagnosis:</strong> {record.diagnosis}
            </div>
            <div className={styles.recordPrescription}>
              <strong>Prescription:</strong> {record.prescription}
            </div>
            <div className={styles.recordActions}>
              <Link href={`/admin/medical-records/${record.id}`} className={styles.viewBtn}>
                View Details
              </Link>
              <button className={styles.downloadBtn}>Download</button>
            </div>
          </div>
        ))}
        {records.length === 0 && (
          <p className={styles.noRecords}>No medical records found</p>
        )}
      </div>
    </div>
  );
}

// Appointments Tab Component
function AppointmentsTab({ appointments, patientId }) {
  return (
    <div className={styles.appointmentsTab}>
      <div className={styles.appointmentsHeader}>
        <h3>Appointment History</h3>
        <Link href={`/admin/appointments/new?patientId=${patientId}`} className={styles.scheduleBtn}>
          + Schedule New
        </Link>
      </div>

      <div className={styles.tableContainer}>
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
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td>{apt.date}</td>
                <td>{apt.time}</td>
                <td>Dr. {apt.doctor}</td>
                <td>{apt.department}</td>
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
        {appointments.length === 0 && (
          <p className={styles.noData}>No appointments found</p>
        )}
      </div>
    </div>
  );
}

// Billing Tab Component
function BillingTab({ billing, patientId }) {
  const totalBilled = billing.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = billing.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = billing.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className={styles.billingTab}>
      <div className={styles.billingHeader}>
        <h3>Billing Summary</h3>
        <Link href={`/admin/billing/invoices/new?patientId=${patientId}`} className={styles.newInvoiceBtn}>
          + Create Invoice
        </Link>
      </div>

      <div className={styles.billingStats}>
        <div className={styles.billingStat}>
          <span className={styles.statLabel}>Total Billed</span>
          <span className={styles.statAmount}>${totalBilled.toFixed(2)}</span>
        </div>
        <div className={styles.billingStat}>
          <span className={styles.statLabel}>Paid</span>
          <span className={styles.statAmount}>${totalPaid.toFixed(2)}</span>
        </div>
        <div className={styles.billingStat}>
          <span className={styles.statLabel}>Pending</span>
          <span className={styles.statAmount}>${totalPending.toFixed(2)}</span>
        </div>
        <div className={styles.billingStat}>
          <span className={styles.statLabel}>Balance</span>
          <span className={styles.statAmount}>${(totalBilled - totalPaid).toFixed(2)}</span>
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
          {billing.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.number}</td>
              <td>{invoice.date}</td>
              <td>{invoice.description}</td>
              <td>${invoice.amount.toFixed(2)}</td>
              <td>
                <StatusBadge status={invoice.status} />
              </td>
              <td>
                <Link href={`/admin/billing/invoices/${invoice.id}`} className={styles.actionLink}>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {billing.length === 0 && (
        <p className={styles.noData}>No invoices found</p>
      )}
    </div>
  );
}

// Documents Tab Component
function DocumentsTab({ patientId }) {
  const [documents, setDocuments] = useState([]);

  return (
    <div className={styles.documentsTab}>
      <div className={styles.documentsHeader}>
        <h3>Documents</h3>
        <button className={styles.uploadBtn}>+ Upload Document</button>
      </div>

      <div className={styles.documentsGrid}>
        {documents.map((doc) => (
          <div key={doc.id} className={styles.documentCard}>
            <div className={styles.documentIcon}>📄</div>
            <div className={styles.documentInfo}>
              <h4>{doc.name}</h4>
              <p>{doc.size}</p>
            </div>
            <div className={styles.documentActions}>
              <button className={styles.downloadBtn}>⬇️</button>
              <button className={styles.deleteBtn}>🗑️</button>
            </div>
          </div>
        ))}
        {documents.length === 0 && (
          <p className={styles.noDocuments}>No documents uploaded</p>
        )}
      </div>
    </div>
  );
    }
