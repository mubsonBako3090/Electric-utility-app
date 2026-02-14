'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './new-patient.module.css';

export default function NewPatientPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    
    // Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    
    // Emergency Contact
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    emergencyEmail: '',
    
    // Insurance Information
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceGroupNumber: '',
    insuranceExpiryDate: '',
    
    // Medical Information
    allergies: '',
    chronicConditions: '',
    currentMedications: '',
    previousSurgeries: '',
    familyHistory: '',
    
    // Primary Care
    primaryDoctor: '',
    preferredPharmacy: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    }
    
    if (currentStep === 2) {
      if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    }
    
    if (currentStep === 3) {
      if (!formData.emergencyName) newErrors.emergencyName = 'Emergency contact name is required';
      if (!formData.emergencyPhone) newErrors.emergencyPhone = 'Emergency phone is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/admin/patients?success=Patient created successfully');
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Failed to create patient' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: 'Personal Info' },
      { number: 2, label: 'Address' },
      { number: 3, label: 'Emergency Contact' },
      { number: 4, label: 'Insurance' },
      { number: 5, label: 'Medical History' }
    ];

    return (
      <div className={styles.stepIndicator}>
        {steps.map((step) => (
          <div key={step.number} className={styles.stepWrapper}>
            <div 
              className={`${styles.stepCircle} 
                ${currentStep > step.number ? styles.completed : ''} 
                ${currentStep === step.number ? styles.active : ''}`}
            >
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <div className={styles.stepLabel}>{step.label}</div>
            {step.number < steps.length && (
              <div className={`${styles.stepLine} ${currentStep > step.number ? styles.completedLine : ''}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Personal Information</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
                  placeholder="John"
                />
                {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.lastName ? styles.error : ''}`}
                  placeholder="Doe"
                />
                {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.email ? styles.error : ''}`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.dateOfBirth ? styles.error : ''}`}
                />
                {errors.dateOfBirth && <span className={styles.errorMessage}>{errors.dateOfBirth}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.gender ? styles.error : ''}`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <span className={styles.errorMessage}>{errors.gender}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
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
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Marital Status</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Address Information</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Address Line 1 *</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                className={`${styles.input} ${errors.addressLine1 ? styles.error : ''}`}
                placeholder="123 Main Street"
              />
              {errors.addressLine1 && <span className={styles.errorMessage}>{errors.addressLine1}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className={styles.input}
                placeholder="Apt #4B"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.city ? styles.error : ''}`}
                  placeholder="New York"
                />
                {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.state ? styles.error : ''}`}
                  placeholder="NY"
                />
                {errors.state && <span className={styles.errorMessage}>{errors.state}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.zipCode ? styles.error : ''}`}
                  placeholder="10001"
                />
                {errors.zipCode && <span className={styles.errorMessage}>{errors.zipCode}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Emergency Contact</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Name *</label>
              <input
                type="text"
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleChange}
                className={`${styles.input} ${errors.emergencyName ? styles.error : ''}`}
                placeholder="Jane Doe"
              />
              {errors.emergencyName && <span className={styles.errorMessage}>{errors.emergencyName}</span>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Relationship *</label>
                <input
                  type="text"
                  name="emergencyRelationship"
                  value={formData.emergencyRelationship}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.emergencyRelationship ? styles.error : ''}`}
                  placeholder="Spouse"
                />
                {errors.emergencyRelationship && <span className={styles.errorMessage}>{errors.emergencyRelationship}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone *</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.emergencyPhone ? styles.error : ''}`}
                  placeholder="+1 (555) 987-6543"
                />
                {errors.emergencyPhone && <span className={styles.errorMessage}>{errors.emergencyPhone}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email (Optional)</label>
              <input
                type="email"
                name="emergencyEmail"
                value={formData.emergencyEmail}
                onChange={handleChange}
                className={styles.input}
                placeholder="jane.doe@example.com"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Insurance Information</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Insurance Provider</label>
              <input
                type="text"
                name="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={handleChange}
                className={styles.input}
                placeholder="Blue Cross Blue Shield"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Policy Number</label>
                <input
                  type="text"
                  name="insurancePolicyNumber"
                  value={formData.insurancePolicyNumber}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="BCBS-12345"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Group Number</label>
                <input
                  type="text"
                  name="insuranceGroupNumber"
                  value={formData.insuranceGroupNumber}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="GRP-6789"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Insurance Expiry Date</label>
              <input
                type="date"
                name="insuranceExpiryDate"
                value={formData.insuranceExpiryDate}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Medical History</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Allergies</label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="List any allergies (e.g., Penicillin, Peanuts, Latex)"
                rows="3"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Chronic Conditions</label>
              <textarea
                name="chronicConditions"
                value={formData.chronicConditions}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="List any chronic conditions (e.g., Diabetes, Hypertension)"
                rows="3"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Current Medications</label>
              <textarea
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="List current medications with dosage"
                rows="3"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Previous Surgeries</label>
              <textarea
                name="previousSurgeries"
                value={formData.previousSurgeries}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="List any previous surgeries with dates"
                rows="3"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Family History</label>
              <textarea
                name="familyHistory"
                value={formData.familyHistory}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Relevant family medical history"
                rows="3"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Primary Doctor</label>
                <input
                  type="text"
                  name="primaryDoctor"
                  value={formData.primaryDoctor}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Dr. Smith"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Preferred Pharmacy</label>
                <input
                  type="text"
                  name="preferredPharmacy"
                  value={formData.preferredPharmacy}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="CVS Pharmacy"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Register New Patient</h1>
        <p className={styles.subtitle}>Fill in the patient information below</p>
      </div>

      {renderStepIndicator()}

      {errors.submit && (
        <div className={styles.errorAlert}>
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {renderStepContent()}

        <div className={styles.formActions}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className={styles.secondaryButton}
            >
              ← Previous
            </button>
          )}
          
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className={styles.primaryButton}
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={loading}
            >
              {loading ? 'Creating Patient...' : 'Create Patient'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
              }
