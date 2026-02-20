import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  month: String,
  totalHours: Number,
  loadFactor: Number,
  amount: Number,
  breakdown: Object,
}, { timestamps: true });

export default mongoose.models.Bill || mongoose.model("Bill", BillSchema);
