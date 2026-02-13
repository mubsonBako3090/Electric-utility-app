import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  specialization: {
    type: String,
    required: [true, 'Please provide specialization'],
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please provide license number'],
    unique: true,
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number,
  }],
  experience: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    startTime: String,
    endTime: String,
    isAvailable: {
      type: Boolean,
      default: true,
    },
  }],
  maxAppointmentsPerDay: {
    type: Number,
    default: 20,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
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

export default mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
