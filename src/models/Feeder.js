import mongoose from 'mongoose';

const feederSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  feederId: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number, // in MW
    required: true,
  },
  currentLoad: {
    type: Number,
    default: 0,
  },
  voltage: {
    type: Number,
    default: 11, // kV
  },
  location: {
    substation: String,
    area: String,
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'faulty', 'offline'],
    default: 'active',
  },
  lastMaintenance: Date,
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Feeder = mongoose.models.Feeder || mongoose.model('Feeder', feederSchema);
export default Feeder;
