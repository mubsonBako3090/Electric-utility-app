'use client';

import React, { useState } from 'react';
import styles from './ComplaintForm.module.css';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import clsx from 'clsx';

const ComplaintForm = ({ onSubmit, initialData = {}, isLoading = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    complaint: {
      category: initialData.category || '',
      title: initialData.title || '',
      description: initialData.description || '',
      urgencyLevel: initialData.urgencyLevel || 'normal',
    },
    incident: {
      date: initialData.incidentDate || '',
      location: {
        address: initialData.location?.address || '',
        state: initialData.location?.state || '',
        lga: initialData.location?.lga || '',
      },
    },
    respondent: {
      name: initialData.respondent?.name || '',
      organization: initialData.respondent?.organization || '',
      contactInfo: initialData.respondent?.contactInfo || '',
    },
  });

  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);

  const categories = [
    'Unpaid Salary',
    'Land Dispute',
    'Police Brutality',
    'Missing Person',
    'Domestic Violence',
    'Corruption',
    'Employment Issues',
    'Human Rights Violation',
    'Family Matter',
    'Consumer Rights',
    'Environmental Issue',
    'Other',
  ];

  const states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  ];

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: field.includes('.') 
        ? updateNestedField(prev[section], field, value)
        : { ...prev[section], [field]: value }
    }));
    
    // Clear error for this field
    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${section}.${field}`];
        return newErrors;
      });
    }
  };

  const updateNestedField = (obj, path, value) => {
    const parts = path.split('.');
    const newObj = { ...obj };
    let current = newObj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = { ...current[parts[i]] };
      current = current[parts[i]];
    }
    
    current[parts[parts.length - 1]] = value;
    return newObj;
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.complaint.category) {
        newErrors['complaint.category'] = 'Category is required';
      }
      if (!formData.complaint.title) {
        newErrors['complaint.title'] = 'Title is required';
      }
      if (!formData.complaint.description) {
        newErrors['complaint.description'] = 'Description is required';
      }
    }

    if (step === 2) {
      if (!formData.incident.date) {
        newErrors['incident.date'] = 'Incident date is required';
      }
      if (!formData.incident.location.address) {
        newErrors['incident.location.address'] = 'Address is required';
      }
      if (!formData.incident.location.state) {
        newErrors['incident.location.state'] = 'State is required';
      }
      if (!formData.incident.location.lga) {
        newErrors['incident.location.lga'] = 'LGA is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      const submitData = {
        ...formData,
        evidence: files,
      };
      onSubmit(submitData);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>Complaint Details</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Category <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={formData.complaint.category}
                onChange={(e) => handleChange('complaint', 'category', e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors['complaint.category'] && (
                <span className={styles.error}>{errors['complaint.category']}</span>
              )}
            </div>

            <Input
              label="Complaint Title"
              required
              value={formData.complaint.title}
              onChange={(e) => handleChange('complaint', 'title', e.target.value)}
              error={errors['complaint.title']}
              placeholder="Brief summary of your complaint"
              fullWidth
            />

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Description <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textarea}
                rows="6"
                value={formData.complaint.description}
                onChange={(e) => handleChange('complaint', 'description', e.target.value)}
                placeholder="Provide detailed information about your complaint..."
              />
              {errors['complaint.description'] && (
                <span className={styles.error}>{errors['complaint.description']}</span>
              )}
              <div className={styles.charCount}>
                {formData.complaint.description.length}/2000
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>Incident Information</h3>
            
            <Input
              type="date"
              label="Incident Date"
              required
              value={formData.incident.date}
              onChange={(e) => handleChange('incident', 'date', e.target.value)}
              error={errors['incident.date']}
              fullWidth
            />

            <div className={styles.urgencySection}>
              <label className={styles.label}>Urgency Level</label>
              <div className={styles.urgencyOptions}>
                {['normal', 'urgent', 'emergency'].map((level) => (
                  <label key={level} className={styles.urgencyOption}>
                    <input
                      type="radio"
                      name="urgency"
                      value={level}
                      checked={formData.complaint.urgencyLevel === level}
                      onChange={(e) => handleChange('complaint', 'urgencyLevel', e.target.value)}
                    />
                    <span className={clsx(styles.urgencyLabel, styles[level])}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Input
              label="Incident Address"
              required
              value={formData.incident.location.address}
              onChange={(e) => handleChange('incident', 'location.address', e.target.value)}
              error={errors['incident.location.address']}
              placeholder="Street address or landmark"
              fullWidth
            />

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  State <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.select}
                  value={formData.incident.location.state}
                  onChange={(e) => handleChange('incident', 'location.state', e.target.value)}
                >
                  <option value="">Select state</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors['incident.location.state'] && (
                  <span className={styles.error}>{errors['incident.location.state']}</span>
                )}
              </div>

              <Input
                label="LGA"
                required
                value={formData.incident.location.lga}
                onChange={(e) => handleChange('incident', 'location.lga', e.target.value)}
                error={errors['incident.location.lga']}
                fullWidth
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>Respondent Information</h3>
            
            <Input
              label="Respondent Name"
              value={formData.respondent.name}
              onChange={(e) => handleChange('respondent', 'name', e.target.value)}
              placeholder="Name of person or organization"
              fullWidth
            />

            <Input
              label="Organization"
              value={formData.respondent.organization}
              onChange={(e) => handleChange('respondent', 'organization', e.target.value)}
              placeholder="If applicable"
              fullWidth
            />

            <Input
              label="Contact Information"
              value={formData.respondent.contactInfo}
              onChange={(e) => handleChange('respondent', 'contactInfo', e.target.value)}
              placeholder="Phone, email, or address"
              multiline
              rows={2}
              fullWidth
            />
          </div>
        );

      case 4:
        return (
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>Evidence & Submit</h3>
            
            <div className={styles.evidenceSection}>
              <label className={styles.label}>Upload Supporting Evidence</label>
              <p className={styles.hint}>
                Upload any documents, photos, or recordings (Max 10 files, 10MB each)
              </p>
              
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.mp3,.mp4"
                  className={styles.fileInput}
                />
                <label htmlFor="file-upload" className={styles.uploadLabel}>
                  <span className={styles.uploadIcon}>📤</span>
                  <span>Drag & drop files or click to browse</span>
                  <span className={styles.uploadHint}>
                    Supported: JPG, PNG, PDF, DOC, MP3, MP4
                  </span>
                </label>
              </div>

              {files.length > 0 && (
                <div className={styles.fileList}>
                  <h4>Uploaded Files:</h4>
                  {files.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <span className={styles.fileIcon}>
                        {file.type.startsWith('image/') ? '🖼️' : 
                         file.type.startsWith('audio/') ? '🎵' :
                         file.type.startsWith('video/') ? '🎥' : '📄'}
                      </span>
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.fileSize}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <button
                        type="button"
                        className={styles.removeFile}
                        onClick={() => removeFile(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.confirmation}>
                <label className={styles.checkbox}>
                  <input type="checkbox" required />
                  <span>
                    I confirm that all information provided is true and accurate
                    to the best of my knowledge.
                  </span>
                </label>

                <label className={styles.checkbox}>
                  <input type="checkbox" required />
                  <span>
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={styles.complaintForm}>
      <div className={styles.steps}>
        <div className={clsx(styles.stepIndicator, currentStep >= 1 && styles.active)}>
          <span className={styles.stepNumber}>1</span>
          <span className={styles.stepLabel}>Complaint</span>
        </div>
        <div className={clsx(styles.stepConnector, currentStep >= 2 && styles.active)} />
        <div className={clsx(styles.stepIndicator, currentStep >= 2 && styles.active)}>
          <span className={styles.stepNumber}>2</span>
          <span className={styles.stepLabel}>Incident</span>
        </div>
        <div className={clsx(styles.stepConnector, currentStep >= 3 && styles.active)} />
        <div className={clsx(styles.stepIndicator, currentStep >= 3 && styles.active)}>
          <span className={styles.stepNumber}>3</span>
          <span className={styles.stepLabel}>Respondent</span>
        </div>
        <div className={clsx(styles.stepConnector, currentStep >= 4 && styles.active)} />
        <div className={clsx(styles.stepIndicator, currentStep >= 4 && styles.active)}>
          <span className={styles.stepNumber}>4</span>
          <span className={styles.stepLabel}>Evidence</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}

        <div className={styles.formActions}>
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isLoading}
            >
              ← Back
            </Button>
          )}
          
          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
            >
              Continue →
            </Button>
          ) : (
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Submit Complaint
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default ComplaintForm;
