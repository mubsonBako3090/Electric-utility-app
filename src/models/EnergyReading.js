import mongoose from 'mongoose';

const energyReadingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  readingValue: {
    type: Number,
    required: true,
  },
  readingDate: {
    type: Date,
    required: true,
  },
  readingType: {
    type: String,
    enum: ['manual', 'automated', 'estimated'],
    default: 'manual',
  },
  meterImage: String,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  consumption: {
    type: Number, // calculated consumption since last reading
  },
}, { timestamps: true });

// Index for efficient queries
energyReadingSchema.index({ customerId: 1, readingDate: -1 });

const EnergyReading = mongoose.models.EnergyReading || mongoose.model('EnergyReading', energyReadingSchema);
export default EnergyReading;
