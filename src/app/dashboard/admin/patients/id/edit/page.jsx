'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PatientForm from '@/components/forms/PatientForm';
import { usePatients } from '@/hooks/usePatients';
import { useNotifications } from '@/context/NotificationContext';
import Button from '@/components/ui/Button';
import styles from './edit-patient.module.css';

export default function EditPatientPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { getPatient, updatePatient, loading } = usePatients();
  const { showSuccess, showError } = useNotifications();
  
  const [patient, setPatient] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const result = await getPatient(id);
      if (result.success) {
        setPatient(result.data);
      } else {
        showError('Failed to load patient data');
        router.push('/admin/patients');
      }
    } catch (error) {
      showError('Error loading patient');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const result = await updatePatient(id, formData);
      if (result.success) {
        showSuccess('Patient updated successfully');
        router.push(`/admin/patients/${id}`);
      } else {
        showError(result.error || 'Failed to update patient');
      }
    } catch (error) {
      showError('An error occurred');
    }
  };

  if (initialLoading) {
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
        <Button onClick={() => router.push('/admin/patients')}>
          Back to Patients
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Patient</h1>
        <p className={styles.subtitle}>Update patient information for {patient.name}</p>
      </div>

      <div className={styles.formCard}>
        <PatientForm 
          initialData={patient}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
    }
