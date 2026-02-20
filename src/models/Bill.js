import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  billNumber: {
    type: String,
    required: true,
    unique: true,
  },
  billingPeriod: {
    from: Date,
    to: Date,
  },
  dueDate: Date,
  previousReading: {
    value: Number,
    date: Date,
  },
  currentReading: {
    value: Number,
    date: Date,
  },
  unitsConsumed: Number,
  tariffRate: Number,
  energyCharges: Number,
  fixedCharges: Number,
  taxes: Number,
  totalAmount: Number,
  status: {
    type: String,
    enum: ['generated', 'sent', 'paid', 'overdue', 'disputed'],
    default: 'generated',
  },
  paymentDate: Date,
  paymentMethod: String,
}, { timestamps: true });

const Bill = mongoose.models.Bill || mongoose.model('Bill', billSchema);
export default Bill;
