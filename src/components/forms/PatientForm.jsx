'use client';

import { useState } from 'react';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import styles from './PatientForm.module.css';

export default function PatientForm({ initialData = {}, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    dateOfBirth: initialData.dateOfBirth || '',
    gender: initialData.gender || '',
    bloodGroup: initialData.bloodGroup || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zipCode: initialData.zipCode || '',
    emergencyName: initialData.emergencyName || '',
    emergencyRelationship: initialData.emergencyRelationship || '',
    emergencyPhone: initialData.emergencyPhone || '',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
      // Mark all fields as touched
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

        <div className={styles.row}>
          <FormInput
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.dateOfBirth}
            touched={touched.dateOfBirth}
            required
          />
          
          <FormInput
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.gender}
            touched={touched.gender}
            required
          />
        </div>

        <div className={styles.row}>
          <FormInput
            label="Blood Group"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.bloodGroup}
            touched={touched.bloodGroup}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Address</h3>
        
        <FormInput
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.address}
          touched={touched.address}
        />

        <div className={styles.row}>
          <FormInput
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.city}
            touched={touched.city}
          />
          
          <FormInput
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.state}
            touched={touched.state}
          />
        </div>

        <div className={styles.row}>
          <FormInput
            label="ZIP Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.zipCode}
            touched={touched.zipCode}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Emergency Contact</h3>
        
        <div className={styles.row}>
          <FormInput
            label="Contact Name"
            name="emergencyName"
            value={formData.emergencyName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.emergencyName}
            touched={touched.emergencyName}
          />
          
          <FormInput
            label="Relationship"
            name="emergencyRelationship"
            value={formData.emergencyRelationship}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.emergencyRelationship}
            touched={touched.emergencyRelationship}
          />
        </div>

        <div className={styles.row}>
          <FormInput
            label="Emergency Phone"
            type="tel"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.emergencyPhone}
            touched={touched.emergencyPhone}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={loading} fullWidth>
          {loading ? 'Saving...' : 'Save Patient'}
        </Button>
      </div>
    </form>
  );
         }
