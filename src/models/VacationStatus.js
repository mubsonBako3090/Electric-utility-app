import mongoose from 'mongoose';

const vacationStatusSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  
  vacationId: {
    type: String,
    required: true,
    unique: true,
  },
  
  type: {
    type: String,
    enum: ['vacation', 'temporary_relocation', 'property_vacant', 'renovation'],
    required: true,
  },
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'completed', 'cancelled', 'rejected'],
    default: 'pending',
  },
  
  // Date range
  fromDate: {
    type: Date,
    required: true,
  },
  
  toDate: {
    type: Date,
    required: true,
  },
  
  duration: {
    type: Number, // in days
  },
  
  // Contact information during vacation
  contactDuringVacation: {
    phone: String,
    email: String,
    address: String,
  },
  
  // Alternate contact for emergency
  alternateContact: {
    name: String,
    phone: String,
    relation: String,
  },
  
  // Property status
  propertyStatus: {
    locked: { type: Boolean, default: true },
    appliancesOff: { type: Boolean, default: false },
    meterAccessible: { type: Boolean, default: true },
    hasPets: { type: Boolean, default: false },
  },
  
  // Billing preferences during vacation
  billingPreference: {
    type: String,
    enum: ['average_based', 'minimum_charge', 'estimated', 'no_change'],
    default: 'estimated',
  },
  
  estimatedUsage: {
    type: Number, // estimated kWh during vacation
  },
  
  // Documents
  documents: [{
    type: String, // URLs to uploaded documents
    name: String,
    uploadedAt: Date,
  }],
  
  // Verification
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  verifiedAt: Date,
  
  // Approval
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: Date,
  approvalNotes: String,
  
  // Cancellation
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  cancellationReason: String,
  
  // Actual return (if early/late)
  actualReturnDate: Date,
  
  // Feedback after return
  feedback: {
    rating: Number,
    comments: String,
    submittedAt: Date,
  },
  
  // Metadata
  notes: String,
  attachments: [String],
  
}, { timestamps: true });

// Pre-save middleware to generate vacation ID and calculate duration
vacationStatusSchema.pre('save', async function(next) {
  if (!this.vacationId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await mongoose.model('VacationStatus').countDocuments();
    this.vacationId = `VAC${year}${month}${(count + 1).toString().padStart(6, '0')}`;
  }
  
  // Calculate duration
  if (this.fromDate && this.toDate) {
    this.duration = Math.ceil((this.toDate - this.fromDate) / (1000 * 60 * 60 * 24));
  }
  
  next();
});

// Indexes
vacationStatusSchema.index({ customerId: 1, status: 1 });
vacationStatusSchema.index({ fromDate: 1, toDate: 1 });
vacationStatusSchema.index({ status: 1, fromDate: 1 });

const VacationStatus = mongoose.models.VacationStatus || mongoose.model('VacationStatus', vacationStatusSchema);
export default VacationStatus;
