'use client';

import { useState } from 'react';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import styles from './DoctorForm.module.css';

export default function DoctorForm({ initialData = {}, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    specialization: initialData.specialization || '',
    licenseNumber: initialData.licenseNumber || '',
    experience: initialData.experience || '',
    department: initialData.department || '',
    consultationFee: initialData.consultationFee || '',
    qualifications: initialData.qualifications || [],
    availability: initialData.availability || [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Saturday', startTime: '', endTime: '', isAvailable: false },
      { day: 'Sunday', startTime: '', endTime: '', isAvailable: false }
    ],
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [qualificationInput, setQualificationInput] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = {
      ...newAvailability[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      availability: newAvailability
    }));
  };

  const handleAddQualification = () => {
    if (qualificationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, qualificationInput.trim()]
      }));
      setQualificationInput('');
    }
  };

  const handleRemoveQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.consultationFee) newErrors.consultationFee = 'Consultation fee is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
      const allTouched = {};
      Object.keys(formData).forEach(key => allTouched[key] = true);
      setTouched(allTouched);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        
        <div className={styles.row}>
          <FormInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.firstName}
            touched={touched.firstName}
            required
          />
          
          <FormInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.lastName}
            touched={touched.lastName}
            required
          />
        </div>

        <div className={styles.row}>
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
            required
          />
          
          <FormInput
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
            touched={touched.phone}
            required
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Professional Information</h3>
        
        <div className={styles.row}>
          <FormInput
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.specialization}
            touched={touched.specialization}
            required
          />
          
          <FormInput
            label="License Number"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.licenseNumber}
            touched={touched.licenseNumber}
            required
          />
        </div>

        <div className={styles.row}>
          <FormInput
            label="Years of Experience"
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.experience}
            touched={touched.experience}
            required
          />
          
          <FormInput
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.department}
            touched={touched.department}
            required
          />
        </div>

        <div className={styles.row}>
          <FormInput
            label="Consultation Fee ($)"
            type="number"
            name="consultationFee"
            value={formData.consultationFee}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.consultationFee}
            touched={touched.consultationFee}
            required
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Qualifications</h3>
        
        <div className={styles.qualificationInput}>
          <input
            type="text"
            value={qualificationInput}
            onChange={(e) => setQualificationInput(e.target.value)}
            placeholder="Enter qualification (e.g., MBBS, MD, MS)"
            className={styles.input}
          />
          <Button type="button" onClick={handleAddQualification} size="small">
            Add
          </Button>
        </div>

        <div className={styles.qualificationList}>
          {formData.qualifications.map((qual, index) => (
            <div key={index} className={styles.qualificationItem}>
              <span>{qual}</span>
              <button
                type="button"
                onClick={() => handleRemoveQualification(index)}
                className={styles.removeBtn}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Availability Schedule</h3>
        
        <div className={styles.availabilityTable}>
          <div className={styles.availabilityHeader}>
            <span>Day</span>
            <span>Available</span>
            <span>Start Time</span>
            <span>End Time</span>
          </div>
          
          {daysOfWeek.map((day, index) => (
            <div key={day} className={styles.availabilityRow}>
              <span className={styles.dayLabel}>{day}</span>
              
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.availability[index]?.isAvailable || false}
                  onChange={(e) => handleAvailabilityChange(index, 'isAvailable', e.target.checked)}
                  className={styles.checkbox}
                />
              </label>
              
              <input
                type="time"
                value={formData.availability[index]?.startTime || ''}
                onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                disabled={!formData.availability[index]?.isAvailable}
                className={styles.timeInput}
              />
              
              <input
                type="time"
                value={formData.availability[index]?.endTime || ''}
                onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                disabled={!formData.availability[index]?.isAvailable}
                className={styles.timeInput}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={loading} fullWidth>
          {loading ? 'Saving...' : 'Save Doctor'}
        </Button>
      </div>
    </form>
  );
      }
