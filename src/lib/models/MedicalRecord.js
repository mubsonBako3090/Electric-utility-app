import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  recordType: {
    type: String,
    enum: ['diagnosis', 'prescription', 'lab-report', 'imaging', 'surgery', 'follow-up'],
    required: true,
  },
  diagnosis: String,
  symptoms: [String],
  prescriptions: [{
    medication: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
  }],
  labTests: [{
    testName: String,
    results: String,
    date: Date,
    fileUrl: String,
  }],
  vitalSigns: {
    temperature: Number,
    heartRate: Number,
    bloodPressure: String,
    respiratoryRate: Number,
    oxygenSaturation: Number,
    weight: Number,
    height: Number,
  },
  notes: String,
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: Date,
  }],
  followUpDate: Date,
  isConfidential: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', medicalRecordSchema);
