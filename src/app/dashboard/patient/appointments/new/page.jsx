'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppointments } from '@/hooks/useAppointments';
import { useNotifications } from '@/context/NotificationContext';
import Button from '@/components/ui/Button';
import styles from './new-appointment.module.css';

export default function NewAppointmentPage() {
  const router = useRouter();
  const { createAppointment, getAvailableSlots } = useAppointments();
  const { showSuccess, showError } = useNotifications();

  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    reason: '',
    notes: '',
    type: 'consultation'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

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
      const result = await getAvailableSlots(selectedDoctor.id, selectedDate);
      if (result.success) {
        setAvailableSlots(result.data);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentData = {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        type: formData.type,
        reason: formData.reason,
        notes: formData.notes
      };

      const result = await createAppointment(appointmentData);
      
      if (result.success) {
        showSuccess('Appointment booked successfully!');
        router.push('/patient/appointments');
      } else {
        showError(result.error || 'Failed to book appointment');
      }
    } catch (error) {
      showError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Book New Appointment</h1>
        <p className={styles.subtitle}>Schedule your visit with our specialists</p>
      </div>

      {/* Progress Steps */}
      <div className={styles.progressBar}>
        <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>1</span>
          <span className={styles.stepLabel}>Select Doctor</span>
        </div>
        <div className={`${styles.stepLine} ${step >= 2 ? styles.active : ''}`}></div>
        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>2</span>
          <span className={styles.stepLabel}>Choose Time</span>
        </div>
        <div className={`${styles.stepLine} ${step >= 3 ? styles.active : ''}`}></div>
        <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>3</span>
          <span className={styles.stepLabel}>Confirm Details</span>
        </div>
      </div>

      <div className={styles.content}>
        {step === 1 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Select a Doctor</h2>
            <div className={styles.doctorsGrid}>
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  className={styles.doctorCard}
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className={styles.doctorAvatar}>
                    <img src={doctor.image || '/images/default-avatar.png'} alt={doctor.name} />
                  </div>
                  <h3 className={styles.doctorName}>Dr. {doctor.name}</h3>
                  <p className={styles.doctorSpecialty}>{doctor.specialization}</p>
                  <div className={styles.doctorInfo}>
                    <span>⭐ {doctor.rating} ({doctor.reviews})</span>
                    <span>💰 ${doctor.fee}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedDoctor && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Select Date & Time</h2>
            <p className={styles.doctorSelected}>
              Dr. {selectedDoctor.name} - {selectedDoctor.specialization}
            </p>

            <div className={styles.dateSelector}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateSelect(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={styles.dateInput}
              />
            </div>

            {selectedDate && (
              <div className={styles.slotsGrid}>
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      className={`${styles.slotButton} ${selectedSlot === slot ? styles.selectedSlot : ''}`}
                      onClick={() => handleSlotSelect(slot)}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  ))
                ) : (
                  <p className={styles.noSlots}>No available slots for this date</p>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && selectedDoctor && selectedSlot && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Confirm Appointment Details</h2>
            
            <div className={styles.confirmationCard}>
              <div className={styles.confirmSection}>
                <h3>Doctor Information</h3>
                <p><strong>Name:</strong> Dr. {selectedDoctor.name}</p>
                <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                <p><strong>Experience:</strong> {selectedDoctor.experience} years</p>
              </div>

              <div className={styles.confirmSection}>
                <h3>Appointment Details</h3>
                <p><strong>Date:</strong> {selectedDate}</p>
                <p><strong>Time:</strong> {selectedSlot.startTime} - {selectedSlot.endTime}</p>
                <p><strong>Duration:</strong> {selectedSlot.duration} minutes</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.confirmForm}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Appointment Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className={styles.select}
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="checkup">Checkup</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Reason for Visit</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    className={styles.textarea}
                    rows="3"
                    placeholder="Please describe your symptoms or reason for visit"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Additional Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className={styles.textarea}
                    rows="2"
                    placeholder="Any additional information"
                  />
                </div>

                <div className={styles.formActions}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Booking...' : 'Confirm Appointment'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
    }
