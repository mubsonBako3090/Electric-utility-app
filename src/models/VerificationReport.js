import mongoose from "mongoose";

const VerificationSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  actualCategory: String,
  notes: String,
  approved: Boolean,

}, { timestamps: true });

export default mongoose.models.VerificationReport ||
  mongoose.model("VerificationReport", VerificationSchema);
