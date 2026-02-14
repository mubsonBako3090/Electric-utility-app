'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export function usePatients(options = {}) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const { user, isAuthenticated } = useAuth();

  const fetchPatients = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        search: params.search || '',
        filter: params.filter || 'all',
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
        ...(params.doctorId && { doctorId: params.doctorId }),
        ...(params.status && { status: params.status })
      });

      const response = await fetch(`/api/patients?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();
      
      setPatients(data.patients || data);
      setPagination(data.pagination || {
        page: params.page || 1,
        limit: params.limit || 10,
        total: data.total || data.length,
        totalPages: data.totalPages || 1
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const getPatient = async (patientId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/patients/${patientId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching patient:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (patientData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create patient');
      }

      await fetchPatients();
      return { success: true, data };
    } catch (err) {
      console.error('Error creating patient:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (patientId, patientData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update patient');
      }

      await fetchPatients();
      return { success: true, data };
    } catch (err) {
      console.error('Error updating patient:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (patientId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete patient');
      }

      await fetchPatients();
      return { success: true };
    } catch (err) {
      console.error('Error deleting patient:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = useCallback(async (searchTerm) => {
    return fetchPatients({ ...pagination, search: searchTerm });
  }, [fetchPatients, pagination]);

  const getPatientAppointments = async (patientId) => {
    try {
      const response = await fetch(`/api/patients/${patientId}/appointments`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient appointments');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching patient appointments:', err);
      return { success: false, error: err.message };
    }
  };

  const getPatientBilling = async (patientId) => {
    try {
      const response = await fetch(`/api/patients/${patientId}/billing`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient billing');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching patient billing:', err);
      return { success: false, error: err.message };
    }
  };

  const getPatientMedicalRecords = async (patientId) => {
    try {
      const response = await fetch(`/api/patients/${patientId}/medical-records`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch medical records');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching medical records:', err);
      return { success: false, error: err.message };
    }
  };

  const exportPatients = async (format = 'csv') => {
    try {
      const response = await fetch(`/api/patients/export?format=${format}`);
      
      if (!response.ok) {
        throw new Error('Failed to export patients');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patients.${format}`;
      a.click();
      
      return { success: true };
    } catch (err) {
      console.error('Error exporting patients:', err);
      return { success: false, error: err.message };
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchPatients();
    }
  }, [isAuthenticated]);

  return {
    patients,
    loading,
    error,
    pagination,
    fetchPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients,
    getPatientAppointments,
    getPatientBilling,
    getPatientMedicalRecords,
    exportPatients
  };
}

// Hook for doctor's patients
export function useDoctorPatients(doctorId) {
  const { patients, loading, error, fetchPatients } = usePatients();

  useEffect(() => {
    if (doctorId) {
      fetchPatients({ doctorId });
    }
  }, [doctorId, fetchPatients]);

  return { patients, loading, error };
}

// Hook for recent patients
export function useRecentPatients(limit = 10) {
  const { patients, loading, error, fetchPatients } = usePatients();

  useEffect(() => {
    fetchPatients({ limit, sortBy: 'createdAt', sortOrder: 'desc' });
  }, [limit, fetchPatients]);

  return { patients: patients.slice(0, limit), loading, error };
  }
