import mongoose from "mongoose";

const VacationSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ["active", "ended"], default: "active" },
}, { timestamps: true });

export default mongoose.models.VacationStatus ||
  mongoose.model("VacationStatus", VacationSchema);
