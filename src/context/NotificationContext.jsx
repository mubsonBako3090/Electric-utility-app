'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext({});

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Auto-dismiss after 5 seconds if not persistent
    if (!notification.persistent) {
      setTimeout(() => {
        dismissNotification(newNotification.id);
      }, 5000);
    }

    // Show browser notification if permitted
    if (notification.browser && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icons/notification-icon.png'
      });
    }
  }, []);

  const dismissNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Notification types helpers
  const showSuccess = useCallback((message, options = {}) => {
    addNotification({
      type: 'success',
      title: options.title || 'Success',
      message,
      icon: '✅',
      color: '#48bb78',
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    addNotification({
      type: 'error',
      title: options.title || 'Error',
      message,
      icon: '❌',
      color: '#f56565',
      persistent: true,
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    addNotification({
      type: 'warning',
      title: options.title || 'Warning',
      message,
      icon: '⚠️',
      color: '#ecc94b',
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    addNotification({
      type: 'info',
      title: options.title || 'Info',
      message,
      icon: 'ℹ️',
      color: '#4299e1',
      ...options
    });
  }, [addNotification]);

  // Appointment notifications
  const notifyAppointmentScheduled = useCallback((appointment) => {
    addNotification({
      type: 'appointment',
      title: 'Appointment Scheduled',
      message: `New appointment scheduled for ${appointment.patientName} with Dr. ${appointment.doctorName}`,
      icon: '📅',
      data: { appointmentId: appointment.id },
      action: `/appointments/${appointment.id}`
    });
  }, [addNotification]);

  const notifyAppointmentReminder = useCallback((appointment) => {
    addNotification({
      type: 'reminder',
      title: 'Appointment Reminder',
      message: `You have an appointment tomorrow at ${appointment.time} with Dr. ${appointment.doctorName}`,
      icon: '⏰',
      persistent: true,
      data: { appointmentId: appointment.id },
      action: `/appointments/${appointment.id}`
    });
  }, [addNotification]);

  const notifyAppointmentCancelled = useCallback((appointment) => {
    addNotification({
      type: 'cancelled',
      title: 'Appointment Cancelled',
      message: `Appointment with Dr. ${appointment.doctorName} on ${appointment.date} has been cancelled`,
      icon: '❌',
      data: { appointmentId: appointment.id }
    });
  }, [addNotification]);

  // Billing notifications
  const notifyInvoiceCreated = useCallback((invoice) => {
    addNotification({
      type: 'billing',
      title: 'Invoice Created',
      message: `Invoice #${invoice.number} for $${invoice.amount} has been created`,
      icon: '💰',
      data: { invoiceId: invoice.id },
      action: `/billing/invoices/${invoice.id}`
    });
  }, [addNotification]);

  const notifyPaymentReceived = useCallback((payment) => {
    addNotification({
      type: 'payment',
      title: 'Payment Received',
      message: `Payment of $${payment.amount} received from ${payment.patientName}`,
      icon: '💳',
      data: { paymentId: payment.id }
    });
  }, [addNotification]);

  const notifyInvoiceOverdue = useCallback((invoice) => {
    addNotification({
      type: 'overdue',
      title: 'Invoice Overdue',
      message: `Invoice #${invoice.number} for $${invoice.amount} is overdue`,
      icon: '⚠️',
      color: '#f56565',
      persistent: true,
      data: { invoiceId: invoice.id },
      action: `/billing/invoices/${invoice.id}`
    });
  }, [addNotification]);

  // Patient notifications
  const notifyPatientRegistered = useCallback((patient) => {
    addNotification({
      type: 'patient',
      title: 'New Patient Registered',
      message: `${patient.name} has been registered successfully`,
      icon: '👤',
      data: { patientId: patient.id },
      action: `/patients/${patient.id}`
    });
  }, [addNotification]);

  const notifyMedicalRecordAdded = useCallback((record) => {
    addNotification({
      type: 'medical',
      title: 'Medical Record Added',
      message: `New medical record added for ${record.patientName}`,
      icon: '📋',
      data: { recordId: record.id },
      action: `/medical-records/${record.id}`
    });
  }, [addNotification]);

  // System notifications
  const notifySystemUpdate = useCallback((message) => {
    addNotification({
      type: 'system',
      title: 'System Update',
      message,
      icon: '🔄',
      persistent: true
    });
  }, [addNotification]);

  const notifyMaintenance = useCallback((message) => {
    addNotification({
      type: 'maintenance',
      title: 'Maintenance Alert',
      message,
      icon: '🔧',
      persistent: true,
      color: '#ecc94b'
    });
  }, [addNotification]);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    dismissNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    // Helper methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
    // Domain-specific notifications
    notifyAppointmentScheduled,
    notifyAppointmentReminder,
    notifyAppointmentCancelled,
    notifyInvoiceCreated,
    notifyPaymentReceived,
    notifyInvoiceOverdue,
    notifyPatientRegistered,
    notifyMedicalRecordAdded,
    notifySystemUpdate,
    notifyMaintenance
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Notification List Component (to be used in layout)
export function NotificationList() {
  const { notifications, dismissNotification, markAsRead } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="notification-empty">
        <p>No notifications</p>
      </div>
    );
  }

  return (
    <div className="notification-list">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification-item ${notification.read ? 'read' : 'unread'}`}
          onClick={() => !notification.read && markAsRead(notification.id)}
          style={{ borderLeftColor: notification.color }}
        >
          <div className="notification-icon">{notification.icon}</div>
          <div className="notification-content">
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
            <small>{new Date(notification.timestamp).toLocaleString()}</small>
          </div>
          <button
            className="notification-dismiss"
            onClick={(e) => {
              e.stopPropagation();
              dismissNotification(notification.id);
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// Toast Notification Component
export function ToastContainer() {
  const { notifications, dismissNotification } = useNotifications();
  const toasts = notifications.filter(n => !n.persistent).slice(0, 3);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          style={{ backgroundColor: toast.color }}
        >
          <div className="toast-icon">{toast.icon}</div>
          <div className="toast-content">
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>
          </div>
          <button
            className="toast-close"
            onClick={() => dismissNotification(toast.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// Request notification permission on mount
export function useNotificationPermission() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
}
