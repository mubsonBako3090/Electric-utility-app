'use client';

import { useState, useEffect } from 'react';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import styles from './AppointmentForm.module.css';

export default function AppointmentForm({ initialData = {}, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    patientId: initialData.patientId || '',
    doctorId: initialData.doctorId || '',
    appointmentDate: initialData.appointmentDate || '',
    startTime: initialData.startTime || '',
    endTime: initialData.endTime || '',
    type: initialData.type || 'consultation',
    reason: initialData.reason || '',
    notes: initialData.notes || '',
    status: initialData.status || 'scheduled',
    ...initialData
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      fetchAvailableSlots();
    }
  }, [formData.doctorId, formData.appointmentDate]);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients/list');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors/list');
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(
        `/api/appointments/slots?doctorId=${formData.doctorId}&date=${formData.appointmentDate}`
      );
      const data = await response.json();
      setAvailableSlots(data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectSlot = (startTime, endTime) => {
    setFormData(prev => ({
      ...prev,
      startTime,
      endTime
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

    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.doctorId) newErrors.doctorId = 'Doctor is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';

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
        <h3 className={styles.sectionTitle}>Appointment Details</h3>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Patient *</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.select} ${errors.patientId && touched.patientId ? styles.error : ''}`}
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name} - {patient.patientId}
              </option>
            ))}
          </select>
          {errors.patientId && touched.patientId && (
            <span className={styles.errorMessage}>{errors.patientId}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Doctor *</label>
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.select} ${errors.doctorId && touched.doctorId ? styles.error : ''}`}
          >
            <option value="">Select Doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
          {errors.doctorId && touched.doctorId && (
            <span className={styles.errorMessage}>{errors.doctorId}</span>
          )}
        </div>

        <div className={styles.row}>
          <FormInput
            label="Appointment Date *"
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.appointmentDate}
            touched={touched.appointmentDate}
            min={new Date().toISOString().split('T')[0]}
          />
          
          <FormInput
            label="Appointment Type *"
            name="type"
            value={formData.type}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.type}
            touched={touched.type}
          />
        </div>
      </div>

      {formData.doctorId && formData.appointmentDate && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Available Time Slots</h3>
          
          {availableSlots.length > 0 ? (
            <div className={styles.slots}>
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.slot} ${
                    formData.startTime === slot.startTime ? styles.selected : ''
                  }`}
                  onClick={() => handleSelectSlot(slot.startTime, slot.endTime)}
                >
                  {slot.startTime} - {slot.endTime}
                </button>
              ))}
            </div>
          ) : (
            <p className={styles.noSlots}>No available slots for this date</p>
          )}
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Appointment Information</h3>
        
        <div className={styles.row}>
          <FormInput
            label="Start Time *"
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.startTime}
            touched={touched.startTime}
            disabled={!formData.doctorId}
          />
          
          <FormInput
            label="End Time *"
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.endTime}
            touched={touched.endTime}
            disabled={!formData.doctorId}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Reason for Visit *</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.textarea} ${errors.reason && touched.reason ? styles.error : ''}`}
            rows="3"
            placeholder="Describe the reason for appointment"
          />
          {errors.reason && touched.reason && (
            <span className={styles.errorMessage}>{errors.reason}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={styles.textarea}
            rows="3"
            placeholder="Any additional notes or instructions"
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={loading} fullWidth>
          {loading ? 'Scheduling...' : 'Schedule Appointment'}
        </Button>
      </div>
    </form>
  );
    }
