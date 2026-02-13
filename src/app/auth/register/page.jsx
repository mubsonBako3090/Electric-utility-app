'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Account Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    
    // Personal Info
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    
    // Address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Emergency Contact
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    
    // Medical Info
    allergies: '',
    medicalConditions: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate step 1
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      router.push('/login?registered=true');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Account Information</h2>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                placeholder="John Doe"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="+1234567890"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Personal Information</h2>
            
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <h3 className={styles.subsectionTitle}>Address</h3>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Street Address</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className={styles.input}
                placeholder="123 Main St"
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="New York"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="NY"
                />
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="10001"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="USA"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Emergency Contact & Medical Info</h2>
            
            <h3 className={styles.subsectionTitle}>Emergency Contact</h3>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Contact Name</label>
              <input
                type="text"
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleChange}
                className={styles.input}
                placeholder="Jane Doe"
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Relationship</label>
                <input
                  type="text"
                  name="emergencyRelationship"
                  value={formData.emergencyRelationship}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Spouse"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Emergency Phone</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <h3 className={styles.subsectionTitle}>Medical Information</h3>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Allergies</label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="List any allergies (comma separated)"
                rows="3"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Medical Conditions</label>
              <textarea
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="List any existing medical conditions"
                rows="3"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <Image 
            src="/images/logo.svg" 
            alt="Hospital Logo" 
            width={60} 
            height={60} 
            className={styles.logo}
          />
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join our hospital management system</p>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressSteps}>
            <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''}`}>
              <span className={styles.stepNumber}>1</span>
              <span className={styles.stepLabel}>Account</span>
            </div>
            <div className={`${styles.stepLine} ${step >= 2 ? styles.stepLineActive : ''}`}></div>
            <div className={`${styles.step} ${step >= 2 ? styles.stepActive : ''}`}>
              <span className={styles.stepNumber}>2</span>
              <span className={styles.stepLabel}>Personal</span>
            </div>
            <div className={`${styles.stepLine} ${step >= 3 ? styles.stepLineActive : ''}`}></div>
            <div className={`${styles.step} ${step >= 3 ? styles.stepActive : ''}`}>
              <span className={styles.stepNumber}>3</span>
              <span className={styles.stepLabel}>Medical</span>
            </div>
          </div>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {renderStep()}

          <div className={styles.buttonGroup}>
            {step > 1 && (
              <button 
                type="button" 
                onClick={handlePrevStep}
                className={styles.secondaryButton}
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button 
                type="button" 
                onClick={handleNextStep}
                className={styles.primaryButton}
              >
                Next Step
              </button>
            ) : (
              <button 
                type="submit" 
                className={styles.primaryButton}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </form>

        <p className={styles.footer}>
          Already have an account?
          <Link href="/login" className={styles.loginLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
    }
