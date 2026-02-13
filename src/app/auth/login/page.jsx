'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        redirect: false
      });

      if (result.error) {
        setError(result.error);
      } else {
        // Redirect based on role
        switch(formData.role) {
          case 'admin':
            router.push('/admin');
            break;
          case 'doctor':
            router.push('/doctor');
            break;
          case 'receptionist':
            router.push('/receptionist');
            break;
          default:
            router.push('/patient');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <Image 
            src="/images/logo.svg" 
            alt="Hospital Logo" 
            width={80} 
            height={80} 
            className={styles.logo}
          />
          <h1 className={styles.title}>Hospital Management System</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder="doctor@hospital.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.passwordHeader}>
              <label className={styles.label}>Password</label>
              <Link href="/forgot-password" className={styles.forgotPassword}>
                Forgot?
              </Link>
            </div>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder="••••••••"
              required
            />
          </div>

          <div className={styles.roleSection}>
            <label className={styles.label}>Login as</label>
            <div className={styles.roleSelector}>
              <button 
                type="button"
                className={`${styles.roleButton} ${formData.role === 'admin' ? styles.roleButtonActive : ''}`}
                onClick={() => handleRoleSelect('admin')}
              >
                Admin
              </button>
              <button 
                type="button"
                className={`${styles.roleButton} ${formData.role === 'doctor' ? styles.roleButtonActive : ''}`}
                onClick={() => handleRoleSelect('doctor')}
              >
                Doctor
              </button>
              <button 
                type="button"
                className={`${styles.roleButton} ${formData.role === 'receptionist' ? styles.roleButtonActive : ''}`}
                onClick={() => handleRoleSelect('receptionist')}
              >
                Receptionist
              </button>
              <button 
                type="button"
                className={`${styles.roleButton} ${formData.role === 'patient' ? styles.roleButtonActive : ''}`}
                onClick={() => handleRoleSelect('patient')}
              >
                Patient
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.footer}>
          Don't have an account?
          <Link href="/register" className={styles.registerLink}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
    }
