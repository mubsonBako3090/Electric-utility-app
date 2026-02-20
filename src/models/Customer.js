import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  address: String,
  feederId: { type: mongoose.Schema.Types.ObjectId, ref: "Feeder" },

  category: String, // R1, R2, etc.
  verified: { type: Boolean, default: false },

  inspectionStatus: {
    type: String,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
