'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export function useBilling(options = {}) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    paidInvoices: 0,
    overdueInvoices: 0
  });

  const { user, isAuthenticated } = useAuth();

  const fetchInvoices = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        status: params.status || 'all',
        patientId: params.patientId || '',
        startDate: params.startDate || '',
        endDate: params.endDate || '',
        ...(params.search && { search: params.search })
      });

      const response = await fetch(`/api/billing/invoices?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const data = await response.json();
      
      setInvoices(data.invoices || data);
      setPagination(data.pagination || {
        page: params.page || 1,
        limit: params.limit || 10,
        total: data.total || data.length,
        totalPages: data.totalPages || 1
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/billing/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch billing stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching billing stats:', err);
    }
  }, []);

  const getInvoice = async (invoiceId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/billing/invoices/${invoiceId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoice');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching invoice:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (invoiceData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/billing/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create invoice');
      }

      await fetchInvoices();
      await fetchStats();
      return { success: true, data };
    } catch (err) {
      console.error('Error creating invoice:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (invoiceId, invoiceData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/billing/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update invoice');
      }

      await fetchInvoices();
      return { success: true, data };
    } catch (err) {
      console.error('Error updating invoice:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (invoiceId, paymentData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/billing/invoices/${invoiceId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process payment');
      }

      await fetchInvoices();
      await fetchStats();
      return { success: true, data };
    } catch (err) {
      console.error('Error processing payment:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const voidInvoice = async (invoiceId, reason) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/billing/invoices/${invoiceId}/void`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to void invoice');
      }

      await fetchInvoices();
      await fetchStats();
      return { success: true };
    } catch (err) {
      console.error('Error voiding invoice:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const sendInvoiceEmail = async (invoiceId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/billing/invoices/${invoiceId}/email`, {
        method: 'POST'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send invoice email');
      }

      return { success: true };
    } catch (err) {
      console.error('Error sending invoice email:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId, format = 'pdf') => {
    try {
      const response = await fetch(`/api/billing/invoices/${invoiceId}/download?format=${format}`);
      
      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.${format}`;
      a.click();
      
      return { success: true };
    } catch (err) {
      console.error('Error downloading invoice:', err);
      return { success: false, error: err.message };
    }
  };

  const getPatientBillingHistory = async (patientId) => {
    try {
      const response = await fetch(`/api/billing/patients/${patientId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient billing history');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching patient billing:', err);
      return { success: false, error: err.message };
    }
  };

  const getPaymentMethods = async () => {
    try {
      const response = await fetch('/api/billing/payment-methods');
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      return { success: false, error: err.message };
    }
  };

  const generateReport = async (reportType, dateRange) => {
    try {
      const response = await fetch('/api/billing/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType, dateRange })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error generating report:', err);
      return { success: false, error: err.message };
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchInvoices();
      fetchStats();
    }
  }, [isAuthenticated]);

  return {
    invoices,
    loading,
    error,
    stats,
    pagination,
    fetchInvoices,
    fetchStats,
    getInvoice,
    createInvoice,
    updateInvoice,
    processPayment,
    voidInvoice,
    sendInvoiceEmail,
    downloadInvoice,
    getPatientBillingHistory,
    getPaymentMethods,
    generateReport
  };
}

// Hook for patient's billing
export function usePatientBilling(patientId) {
  const [billing, setBilling] = useState({
    invoices: [],
    summary: {
      totalBilled: 0,
      totalPaid: 0,
      totalPending: 0,
      totalInsurance: 0
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchPatientBilling = async () => {
      try {
        setBilling(prev => ({ ...prev, loading: true }));
        
        const [invoicesRes, summaryRes] = await Promise.all([
          fetch(`/api/billing/patients/${patientId}/invoices`),
          fetch(`/api/billing/patients/${patientId}/summary`)
        ]);

        const invoices = await invoicesRes.json();
        const summary = await summaryRes.json();

        setBilling({
          invoices: invoices.data || [],
          summary: summary.data || {},
          loading: false,
          error: null
        });
      } catch (err) {
        setBilling(prev => ({
          ...prev,
          loading: false,
          error: err.message
        }));
      }
    };

    if (patientId) {
      fetchPatientBilling();
    }
  }, [patientId]);

  return billing;
}

// Hook for payment processing
export function usePaymentProcessor() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const processStripePayment = async (paymentData) => {
    try {
      setProcessing(true);
      setError(null);

      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setProcessing(false);
    }
  };

  const processCashPayment = async (paymentData) => {
    try {
      setProcessing(true);
      setError(null);

      const response = await fetch('/api/payments/cash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setProcessing(false);
    }
  };

  const processInsuranceClaim = async (claimData) => {
    try {
      setProcessing(true);
      setError(null);

      const response = await fetch('/api/payments/insurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Insurance claim failed');
      }

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setProcessing(false);
    }
  };

  return {
    processing,
    error,
    processStripePayment,
    processCashPayment,
    processInsuranceClaim
  };
  }
