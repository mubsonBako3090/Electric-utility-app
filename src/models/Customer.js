import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  customerId: {
    type: String,
    required: true,
    unique: true,
  },
  loadType: {
    type: String,
    enum: ['R1', 'R2', 'R3', 'R4', 'R5', 'C1', 'C2'],
    required: true,
  },
  sanctionedLoad: {
    type: Number, // in kW
    required: true,
  },
  connectionDate: {
    type: Date,
    default: Date.now,
  },
  meterNumber: {
    type: String,
    required: true,
    unique: true,
  },
  lastReading: {
    value: Number,
    date: Date,
  },
  gpsCoordinates: {
    latitude: Number,
    longitude: Number,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'vacation'],
    default: 'active',
  },
}, { timestamps: true });

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
export default Customer;
