'use client';

import { useState, useEffect } from 'react';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import styles from './BillingForm.module.css';

export default function BillingForm({ initialData = {}, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    patientId: initialData.patientId || '',
    doctorId: initialData.doctorId || '',
    appointmentId: initialData.appointmentId || '',
    items: initialData.items || [],
    subtotal: initialData.subtotal || 0,
    tax: initialData.tax || 0,
    discount: initialData.discount || 0,
    total: initialData.total || 0,
    paymentMethod: initialData.paymentMethod || '',
    status: initialData.status || 'draft',
    dueDate: initialData.dueDate || '',
    notes: initialData.notes || '',
    ...initialData
  });

  const [patients, setPatients] = useState([]);
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    unitPrice: 0,
    type: 'consultation'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [formData.items, formData.tax, formData.discount]);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients/list');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * (formData.tax / 100);
    const total = subtotal + taxAmount - formData.discount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      total
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = () => {
    if (newItem.description && newItem.unitPrice > 0) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, {
          ...newItem,
          total: newItem.quantity * newItem.unitPrice
        }]
      }));
      setNewItem({
        description: '',
        quantity: 1,
        unitPrice: 0,
        type: 'consultation'
      });
    }
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
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
    if (formData.items.length === 0) newErrors.items = 'At least one item is required';

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

  const getPaymentMethodIcon = (method) => {
    const icons = {
      cash: '💵',
      card: '💳',
      insurance: '🏥',
      'bank-transfer': '🏦',
      online: '🌐'
    };
    return icons[method] || '💰';
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Billing Information</h3>
        
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

        <div className={styles.row}>
          <FormInput
            label="Tax (%)"
            type="number"
            name="tax"
            value={formData.tax}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.1"
          />
          
          <FormInput
            label="Discount ($)"
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select Method</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="insurance">Insurance</option>
              <option value="bank-transfer">Bank Transfer</option>
              <option value="online">Online Payment</option>
            </select>
          </div>

          <FormInput
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Invoice Items</h3>
        
        <div className={styles.itemsTable}>
          <div className={styles.itemsHeader}>
            <span>Description</span>
            <span>Type</span>
            <span>Quantity</span>
            <span>Unit Price</span>
            <span>Total</span>
            <span></span>
          </div>

          {formData.items.map((item, index) => (
            <div key={index} className={styles.itemRow}>
              <span>{item.description}</span>
              <span className={styles.itemType}>{item.type}</span>
              <span>{item.quantity}</span>
              <span>${item.unitPrice}</span>
              <span>${item.quantity * item.unitPrice}</span>
              <span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className={styles.removeBtn}
                >
                  ✕
                </button>
              </span>
            </div>
          ))}

          <div className={styles.addItemRow}>
            <input
              type="text"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              placeholder="Description"
              className={styles.itemInput}
            />
            
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({...newItem, type: e.target.value})}
              className={styles.itemSelect}
            >
              <option value="consultation">Consultation</option>
              <option value="lab-test">Lab Test</option>
              <option value="medication">Medication</option>
              <option value="procedure">Procedure</option>
              <option value="other">Other</option>
            </select>
            
            <input
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
              min="1"
              className={styles.itemNumber}
            />
            
            <input
              type="number"
              value={newItem.unitPrice}
              onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value) || 0})}
              min="0"
              step="0.01"
              className={styles.itemNumber}
              placeholder="Price"
            />
            
            <Button type="button" onClick={handleAddItem} size="small">
              Add
            </Button>
          </div>
        </div>

        {errors.items && (
          <span className={styles.errorMessage}>{errors.items}</span>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Summary</h3>
        
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>${formData.subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax ({formData.tax}%):</span>
            <span>${(formData.subtotal * formData.tax / 100).toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Discount:</span>
            <span>-${formData.discount.toFixed(2)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total:</span>
            <span>${formData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Additional Notes</h3>
        
        <div className={styles.formGroup}>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={styles.textarea}
            rows="4"
            placeholder="Any additional notes or instructions"
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={loading} fullWidth>
          {loading ? 'Creating Invoice...' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}
