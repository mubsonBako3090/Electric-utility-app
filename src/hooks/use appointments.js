'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export function useAppointments(options = {}) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const { user, isAuthenticated } = useAuth();

  const fetchAppointments = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        status: params.status || 'all',
        date: params.date || '',
        doctorId: params.doctorId || '',
        patientId: params.patientId || '',
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate })
      });

      const response = await fetch(`/api/appointments?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      
      setAppointments(data.appointments || data);
      setPagination(data.pagination || {
        page: params.page || 1,
        limit: params.limit || 10,
        total: data.total || data.length,
        totalPages: data.totalPages || 1
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const getAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/appointments/${appointmentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointment');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching appointment:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create appointment');
      }

      await fetchAppointments();
      return { success: true, data };
    } catch (err) {
      console.error('Error creating appointment:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (appointmentId, appointmentData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update appointment');
      }

      await fetchAppointments();
      return { success: true, data };
    } catch (err) {
      console.error('Error updating appointment:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId, reason) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to cancel appointment');
      }

      await fetchAppointments();
      return { success: true };
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/appointments/${appointmentId}/complete`, {
        method: 'POST'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to complete appointment');
      }

      await fetchAppointments();
      return { success: true };
    } catch (err) {
      console.error('Error completing appointment:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSlots = async (doctorId, date) => {
    try {
      const response = await fetch(
        `/api/appointments/slots?doctorId=${doctorId}&date=${date}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch available slots');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching slots:', err);
      return { success: false, error: err.message };
    }
  };

  const getTodaysAppointments = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    return fetchAppointments({ date: today });
  }, [fetchAppointments]);

  const getUpcomingAppointments = useCallback(async (days = 7) => {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    return fetchAppointments({
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  }, [fetchAppointments]);

  const rescheduleAppointment = async (appointmentId, newDate, newTime) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/appointments/${appointmentId}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDate, newTime })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to reschedule appointment');
      }

      await fetchAppointments();
      return { success: true };
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const checkInPatient = async (appointmentId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/appointments/${appointmentId}/check-in`, {
        method: 'POST'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to check in patient');
      }

      await fetchAppointments();
      return { success: true };
    } catch (err) {
      console.error('Error checking in patient:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'doctor') {
        fetchAppointments({ doctorId: user.id });
      } else if (user?.role === 'patient') {
        fetchAppointments({ patientId: user.id });
      } else {
        fetchAppointments();
      }
    }
  }, [isAuthenticated, user?.id, user?.role]);

  return {
    appointments,
    loading,
    error,
    pagination,
    fetchAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    completeAppointment,
    getAvailableSlots,
    getTodaysAppointments,
    getUpcomingAppointments,
    rescheduleAppointment,
    checkInPatient
  };
}

// Hook for doctor's appointments
export function useDoctorAppointments(doctorId) {
  const { appointments, loading, error, fetchAppointments } = useAppointments();

  useEffect(() => {
    if (doctorId) {
      fetchAppointments({ doctorId });
    }
  }, [doctorId, fetchAppointments]);

  return { appointments, loading, error };
}

// Hook for patient's appointments
export function usePatientAppointments(patientId) {
  const { appointments, loading, error, fetchAppointments } = useAppointments();

  useEffect(() => {
    if (patientId) {
      fetchAppointments({ patientId });
    }
  }, [patientId, fetchAppointments]);

  return { appointments, loading, error };
}

// Hook for appointment calendar
export function useAppointmentCalendar(initialDate = new Date()) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [appointments, setAppointments] = useState([]);
  const { fetchAppointments, loading } = useAppointments();

  const loadMonthAppointments = useCallback(async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    const result = await fetchAppointments({
      startDate,
      endDate,
      limit: 100
    });
    
    setAppointments(result.appointments || []);
  }, [currentDate, fetchAppointments]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  useEffect(() => {
    loadMonthAppointments();
  }, [currentDate, loadMonthAppointments]);

  return {
    currentDate,
    appointments,
    loading,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    loadMonthAppointments
  };
        }
