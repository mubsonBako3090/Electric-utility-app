'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/lib/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!formData.phone) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        <Card className={styles.registerCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>
              Join thousands of Nigerians seeking justice
            </p>
          </div>

          {error && (
            <Alert type="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.nameRow}>
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                fullWidth
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                fullWidth
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              fullWidth
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0801 234 5678"
              required
              fullWidth
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
              fullWidth
              helperText="Minimum 8 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
              fullWidth
            />

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span>
                I agree to the{' '}
                <Link href="/terms" className={styles.link}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className={styles.link}>
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              className={styles.submitButton}
            >
              Create Account
            </Button>

            <div className={styles.login}>
              <p>
                Already have an account?{' '}
                <Link href="/login" className={styles.loginLink}>
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
