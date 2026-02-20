import mongoose from 'mongoose';

const outageSchema = new mongoose.Schema({
  // Outage Identification
  outageId: {
    type: String,
    required: true,
    unique: true,
  },
  
  // Who reported
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  
  // Outage Details
  type: {
    type: String,
    enum: ['planned', 'unplanned', 'partial', 'complete', 'voltage_fluctuation'],
    required: true,
  },
  
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  
  status: {
    type: String,
    enum: ['reported', 'verified', 'assigned', 'in_progress', 'resolved', 'closed', 'false_alarm'],
    default: 'reported',
  },
  
  // Location Information
  location: {
    area: String,
    street: String,
    city: String,
    pincode: String,
    feederId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feeder',
    },
    transformerId: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  
  // Timing
  reportedAt: {
    type: Date,
    default: Date.now,
  },
  verifiedAt: Date,
  assignedAt: Date,
  startedAt: Date,
  estimatedRestorationAt: Date,
  resolvedAt: Date,
  
  // Duration tracking
  duration: {
    type: Number, // in minutes
    default: 0,
  },
  
  // Description
  description: {
    type: String,
    required: true,
  },
  
  cause: {
    type: String,
    enum: [
      'equipment_failure',
      'weather',
      'accident',
      'maintenance',
      'load_shedding',
      'animal',
      'tree',
      'theft',
      'unknown',
      'other',
    ],
  },
  
  causeDescription: String,
  
  // Affected customers
  affectedCustomers: {
    type: Number,
    default: 0,
  },
  affectedAreas: [String],
  
  // Assignment
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceTeam',
  },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // Updates and communication
  updates: [{
    message: String,
    status: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    estimatedRestoration: Date,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Resolution details
  resolution: {
    action: String,
    notes: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: Date,
  },
  
  // Feedback
  customerFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    submittedAt: Date,
  },
  
  // Metadata
  tags: [String],
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  
  // Statistics
  responseTime: Number, // minutes to respond
  resolutionTime: Number, // minutes to resolve
  
}, { timestamps: true });

// Indexes for better query performance
outageSchema.index({ status: 1, reportedAt: -1 });
outageSchema.index({ location: '2dsphere' });
outageSchema.index({ 'location.feederId': 1 });
outageSchema.index({ reportedBy: 1 });
outageSchema.index({ severity: 1, status: 1 });

// Pre-save middleware to generate outage ID
outageSchema.pre('save', async function(next) {
  if (!this.outageId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await mongoose.model('Outage').countDocuments();
    this.outageId = `OUT${year}${month}${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

// Method to calculate duration
outageSchema.methods.calculateDuration = function() {
  if (this.resolvedAt && this.startedAt) {
    this.duration = Math.round((this.resolvedAt - this.startedAt) / (1000 * 60));
  }
};

// Static method for active outages
outageSchema.statics.findActive = function() {
  return this.find({
    status: { $in: ['reported', 'verified', 'assigned', 'in_progress'] }
  }).sort({ priority: -1, reportedAt: 1 });
};

const Outage = mongoose.models.Outage || mongoose.model('Outage', outageSchema);
export default Outage;
