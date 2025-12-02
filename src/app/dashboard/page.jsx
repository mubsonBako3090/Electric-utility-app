'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import styles from '@/styles/Dashboard.module.css';
import Header from '@/components/ui/Header';
import PaymentForm from '@/components/PaymentForm';
import BillList from '@/components/BillList';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();

  const { user, isAuthenticated, loading, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);

  // Payment state
  const [payments, setPayments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Track current bill for PaymentForm
  const [currentBill, setCurrentBill] = useState(null);

  const handlePay = (payment) => {
    setPayments((prev) => [...prev, payment]);
    setShowPaymentForm(false); // close form after payment
  };

  const openPaymentForm = () => {
    // Only open if currentBill exists
    if (dashboardData?.currentBill) {
      setCurrentBill(dashboardData.currentBill);
      setShowPaymentForm(true);
    } else {
      alert("No bill available to pay.");
    }
  };
  const closePaymentForm = () => setShowPaymentForm(false);

  useEffect(() => {
    if (isAuthenticated) fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const mockData = {
        currentBill: { id: 1, billNumber: "INV-001", amount: 125, dueDate: '2024-01-15', status: 'pending' },
        usage: { current: 450, previous: 420, unit: 'kWh' },
        outages: { reported: 2, resolved: 1 },
        notifications: [
          { id: 1, type: 'info', message: 'Scheduled maintenance on Jan 20th', date: '2024-01-10' },
          { id: 2, type: 'warning', message: 'Your bill is due in 5 days', date: '2024-01-10' },
        ],
      };
      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (!result.success) {
      alert('Logout failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className={styles.unauthorized}>
          <div className="container text-center">
            <i className="bi bi-shield-exclamation"></i>
            <h2>Access Denied</h2>
            <p>Please log in to access your dashboard.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className={styles.dashboard}>
        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1>Welcome back, {user?.firstName}!</h1>
                <p className={styles.welcomeSubtitle}>
                  Account: {user?.accountNumber} • {user?.customerType?.charAt(0).toUpperCase() + user?.customerType?.slice(1)} Customer
                </p>
              </div>
              <div className="col-md-4 text-md-end">
                <div className={styles.accountStatus}>
                  <span className={styles.statusBadge}>
                    <i className="bi bi-check-circle-fill me-1"></i>
                    Active
                  </span>
                </div>
                <button
                  className="btn btn-danger mt-3"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        {dashboardData && (
          <section className="section-padding">
            <div className="container">
              <div className="row">
                {/* Current Bill */}
                <div className="col-md-3 mb-4">
                  <div
                    className={styles.statCard}
                    onClick={() => router.push('/bills')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.statIcon}>
                      <i className="bi bi-receipt"></i>
                    </div>
                    <div className={styles.statContent}>
                      <h3>${dashboardData.currentBill.amount}</h3>
                      <p>Current Bill</p>
                      <small>Due {new Date(dashboardData.currentBill.dueDate).toLocaleDateString()}</small>
                    </div>
                  </div>
                </div>

                {/* Energy Usage */}
                <div className="col-md-3 mb-4">
                  <div
                    className={styles.statCard}
                    onClick={() => router.push('/usage')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.statIcon}>
                      <i className="bi bi-lightning"></i>
                    </div>
                    <div className={styles.statContent}>
                      <h3>{dashboardData.usage.current} {dashboardData.usage.unit}</h3>
                      <p>Energy Usage</p>
                      <small>
                        {dashboardData.usage.current > dashboardData.usage.previous ? '↑' : '↓'} from last month
                      </small>
                    </div>
                  </div>
                </div>

                {/* Outages */}
                <div className="col-md-3 mb-4">
                  <div
                    className={styles.statCard}
                    onClick={() => router.push('/outages')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.statIcon}>
                      <i className="bi bi-house-exclamation"></i>
                    </div>
                    <div className={styles.statContent}>
                      <h3>{dashboardData.outages.reported}</h3>
                      <p>Reported Outages</p>
                      <small>{dashboardData.outages.resolved} resolved</small>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="col-md-3 mb-4">
                  <div
                    className={styles.statCard}
                    onClick={() => router.push('/notifications')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.statIcon}>
                      <i className="bi bi-bell"></i>
                    </div>
                    <div className={styles.statContent}>
                      <h3>{dashboardData.notifications.length}</h3>
                      <p>Notifications</p>
                      <small>Unread alerts</small>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ⭐ PAYMENT SECTION */}
        <section className="section-padding">
          <div className="container">
            <h2 className="section-title mb-4">Make a Payment</h2>

            {/* Button to open payment form */}
            <button className="btn btn-primary mb-3" onClick={openPaymentForm}>
              <i className="bi bi-credit-card me-2"></i> Pay Now
            </button>

            {/* Conditionally render PaymentForm ONLY if a bill exists */}
            {showPaymentForm && currentBill && (
              <PaymentForm
                bill={currentBill}
                onSubmit={handlePay}
                onClose={closePaymentForm}
              />
            )}

            {/* List of Payments */}
            <BillList bills={payments} />
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
}
