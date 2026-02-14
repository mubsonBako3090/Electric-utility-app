'use client';

import { useState, useEffect } from 'react';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import styles from './MedicalRecordForm.module.css';

export default function MedicalRecordForm({ initialData = {}, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    patientId: initialData.patientId || '',
    doctorId: initialData.doctorId || '',
    appointmentId: initialData.appointmentId || '',
    recordType: initialData.recordType || 'diagnosis',
    diagnosis: initialData.diagnosis || '',
    symptoms: initialData.symptoms || [],
    prescriptions: initialData.prescriptions || [],
    labTests: initialData.labTests || [],
    vitalSigns: {
      temperature: initialData.vitalSigns?.temperature || '',
      heartRate: initialData.vitalSigns?.heartRate || '',
      bloodPressure: initialData.vitalSigns?.bloodPressure || '',
      respiratoryRate: initialData.vitalSigns?.respiratoryRate || '',
      oxygenSaturation: initialData.vitalSigns?.oxygenSaturation || '',
      weight: initialData.vitalSigns?.weight || '',
      height: initialData.vitalSigns?.height || ''
    },
    notes: initialData.notes || '',
    followUpDate: initialData.followUpDate || '',
    ...initialData
  });

  const [symptomInput, setSymptomInput] = useState('');
  const [prescription, setPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (formData.patientId) {
      fetchAppointments();
    }
  }, [formData.patientId]);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients/list');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`/api/appointments/patient/${formData.patientId}`);
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('vital.')) {
      const vitalField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vitalSigns: {
          ...prev.vitalSigns,
          [vitalField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddSymptom = () => {
    if (symptomInput.trim()) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, symptomInput.trim()]
      }));
      setSymptomInput('');
    }
  };

  const handleRemoveSymptom = (index) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }));
  };

  const handleAddPrescription = () => {
    if (prescription.medication && prescription.dosage) {
      setFormData(prev => ({
        ...prev,
        prescriptions: [...prev.prescriptions, prescription]
      }));
      setPrescription({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
    }
  };

  const handleRemovePrescription = (index) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index)
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
    if (!formData.recordType) newErrors.recordType = 'Record type is required';
    if (!formData.diagnosis) newErrors.diagnosis = 'Diagnosis is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Record Information</h3>
        
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
                {patient.name}
              </option>
            ))}
          </select>
          {errors.patientId && touched.patientId && (
            <span className={styles.errorMessage}>{errors.patientId}</span>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Record Type *</label>
            <select
              name="recordType"
              value={formData.recordType}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="diagnosis">Diagnosis</option>
              <option value="prescription">Prescription</option>
              <option value="lab-report">Lab Report</option>
              <option value="imaging">Imaging</option>
              <option value="surgery">Surgery</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Related Appointment</label>
            <select
              name="appointmentId"
              value={formData.appointmentId}
              onChange={handleChange}
              className={styles.select}
              disabled={!formData.patientId}
            >
              <option value="">Select Appointment</option>
              {appointments.map(apt => (
                <option key={apt.id} value={apt.id}>
                  {apt.date} - {apt.type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Vital Signs</h3>
        
        <div className={styles.row}>
          <FormInput
            label="Temperature (°C)"
            name="vital.temperature"
            type="number"
            step="0.1"
            value={formData.vitalSigns.temperature}
            onChange={handleChange}
          />
          
          <FormInput
            label="Heart Rate (bpm)"
            name="vital.heartRate"
            type="number"
            value={formData.vitalSigns.heartRate}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <FormInput
            label="Blood Pressure"
            name="vital.bloodPressure"
            value={formData.vitalSigns.bloodPressure}
            onChange={handleChange}
            placeholder="120/80"
          />
          
          <FormInput
            label="Respiratory Rate"
            name="vital.respiratoryRate"
            type="number"
            value={formData.vitalSigns.respiratoryRate}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <FormInput
            label="Oxygen Saturation (%)"
            name="vital.oxygenSaturation"
            type="number"
            value={formData.vitalSigns.oxygenSaturation}
            onChange={handleChange}
          />
          
          <FormInput
            label="Weight (kg)"
            name="vital.weight"
            type="number"
            step="0.1"
            value={formData.vitalSigns.weight}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <FormInput
            label="Height (cm)"
            name="vital.height"
            type="number"
            value={formData.vitalSigns.height}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Diagnosis & Symptoms</h3>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Diagnosis *</label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.textarea} ${errors.diagnosis && touched.diagnosis ? styles.error : ''}`}
            rows="3"
            placeholder="Enter diagnosis"
          />
          {errors.diagnosis && touched.diagnosis && (
            <span className={styles.errorMessage}>{errors.diagnosis}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Symptoms</label>
          <div className={styles.addItem}>
            <input
              type="text"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              placeholder="Add symptom"
              className={styles.input}
            />
            <Button type="button" onClick={handleAddSymptom} size="small">
              Add
            </Button>
          </div>

          <div className={styles.itemList}>
            {formData.symptoms.map((symptom, index) => (
              <div key={index} className={styles.item}>
                <span>{symptom}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSymptom(index)}
                  className={styles.removeBtn}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Prescriptions</h3>
        
        <div className={styles.prescriptionForm}>
          <div className={styles.row}>
            <FormInput
              label="Medication"
              value={prescription.medication}
              onChange={(e) => setPrescription({...prescription, medication: e.target.value})}
              placeholder="Medication name"
            />
            
            <FormInput
              label="Dosage"
              value={prescription.dosage}
              onChange={(e) => setPrescription({...prescription, dosage: e.target.value})}
              placeholder="e.g., 500mg"
            />
          </div>

          <div className={styles.row}>
            <FormInput
              label="Frequency"
              value={prescription.frequency}
              onChange={(e) => setPrescription({...prescription, frequency: e.target.value})}
              placeholder="e.g., Twice daily"
            />
            
            <FormInput
              label="Duration"
              value={prescription.duration}
              onChange={(e) => setPrescription({...prescription, duration: e.target.value})}
              placeholder="e.g., 7 days"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Instructions</label>
            <textarea
              value={prescription.instructions}
              onChange={(e) => setPrescription({...prescription, instructions: e.target.value})}
              className={styles.textarea}
              rows="2"
              placeholder="Special instructions"
            />
          </div>

          <Button type="button" onClick={handleAddPrescription} variant="secondary">
            Add Prescription
          </Button>
        </div>

        <div className={styles.prescriptionList}>
          {formData.prescriptions.map((presc, index) => (
            <div key={index} className={styles.prescriptionItem}>
              <div className={styles.prescriptionHeader}>
                <strong>{presc.medication}</strong>
                <button
                  type="button"
                  onClick={() => handleRemovePrescription(index)}
                  className={styles.removeBtn}
                >
                  ✕
                </button>
              </div>
              <p>Dosage: {presc.dosage}</p>
              <p>Frequency: {presc.frequency}</p>
              <p>Duration: {presc.duration}</p>
              {presc.instructions && <p>Instructions: {presc.instructions}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Additional Information</h3>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={styles.textarea}
            rows="4"
            placeholder="Additional notes"
          />
        </div>

        <FormInput
          label="Follow-up Date"
          type="date"
          name="followUpDate"
          value={formData.followUpDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={loading} fullWidth>
          {loading ? 'Saving...' : 'Save Medical Record'}
        </Button>
      </div>
    </form>
  );
}
