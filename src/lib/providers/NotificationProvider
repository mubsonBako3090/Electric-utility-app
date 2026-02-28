'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import api from '@/lib/api/axios';
import styles from './NotificationProvider.module.css';

// Create context
const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Toast component
const Toast = ({ id, type, title, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert">
      <div className={styles.toastHeader}>
        <span className={styles.toastTitle}>{title || type}</span>
        <button className={styles.toastClose} onClick={() => onClose(id)}>×</button>
      </div>
      <div className={styles.toastMessage}>{message}</div>
    </div>
  );
};

// Toast Container
const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className={styles.toastContainer}>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [socket, setSocket] = useState(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await api.get('/notifications', { params });
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Show toast notification
  const showToast = (type, message, title = '', duration = 5000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
    
    // Also add to notifications list if it's a notification
    if (type !== 'info' && type !== 'success') {
      const newNotification = {
        id,
        type,
        title: title || type,
        message,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }
  };

  // Close toast
  const closeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Connect to WebSocket
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';
    const ws = new WebSocket(`${wsUrl}?userId=${user.id}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Add to notifications
        const newNotification = {
          id: data.id || Date.now(),
          type: data.type,
          title: data.title,
          message: data.message,
          read: false,
          createdAt: new Date().toISOString(),
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show toast
        showToast(data.type, data.message, data.title);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [isAuthenticated, user]);

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  // Notification helpers
  const notify = {
    success: (message, title = 'Success') => showToast('success', message, title),
    error: (message, title = 'Error') => showToast('error', message, title),
    warning: (message, title = 'Warning') => showToast('warning', message, title),
    info: (message, title = 'Info') => showToast('info', message, title),
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    showToast,
    notify,
    closeToast,
    socket,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </NotificationContext.Provider>
  );
};
