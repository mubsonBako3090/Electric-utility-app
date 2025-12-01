'use client';

import { useState } from 'react';
import styles from '@/styles/Login.module.css';

export default function PaymentForm({ onPay, onClose }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bank, setBank] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Example bank list
  const banks = ['Access Bank', 'GTBank', 'Zenith Bank', 'First Bank', 'UBA'];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    if (paymentMethod === 'Bank' && !bank) {
      setError('Please select a bank');
      return;
    }

    setLoading(true);
    setError('');

    // Call onPay with payment details
    onPay({
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      paymentMethod,
      bank: paymentMethod === 'Bank' ? bank : null,
      date: new Date().toISOString(),
    });

    // Reset form fields
    setAmount('');
    setDescription('');
    setPaymentMethod('');
    setBank('');
    setLoading(false);

    // Automatically close the modal
    onClose?.();
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className={styles.authModal} onClick={onClose}>
      <div className={styles.authContent} onClick={stopPropagation}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>

        <div className={styles.authHeader}>
          <i className="bi bi-credit-card"></i>
          <h2>Make a Payment</h2>
          <p>Pay your bills securely and track your payments</p>
        </div>

        {error && (
          <div className={`alert alert-danger ${styles.alert}`}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {/* Amount */}
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount</label>
            <div className={styles.inputGroup}>
              <i className="bi bi-currency-dollar"></i>
              <input
                type="number"
                className="form-control"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="Enter amount"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description (optional)</label>
            <div className={styles.inputGroup}>
              <i className="bi bi-card-text"></i>
              <input
                type="text"
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Payment description"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-3">
            <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
            <div className={styles.inputGroup}>
              <i className="bi bi-wallet2"></i>
              <select
                className="form-select"
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setBank('');
                }}
                required
              >
                <option value="">Select method</option>
                <option value="Bank">Bank Transfer</option>
                <option value="OPay">OPay</option>
                <option value="USSD">USSD</option>
              </select>
            </div>
          </div>

          {/* Bank Selection (only if Bank Transfer) */}
          {paymentMethod === 'Bank' && (
            <div className="mb-3">
              <label htmlFor="bank" className="form-label">Select Bank</label>
              <div className={styles.inputGroup}>
                <i className="bi bi-bank"></i>
                <select
                  className="form-select"
                  id="bank"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  required
                >
                  <option value="">Select bank</option>
                  {banks.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-primary w-100 ${styles.authButton}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
