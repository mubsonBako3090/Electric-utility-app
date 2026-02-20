import mongoose from "mongoose";

const EnergyReadingSchema = new mongoose.Schema({
  feederId: { type: mongoose.Schema.Types.ObjectId, ref: "Feeder" },
  date: Date,
  hoursSupplied: Number,
}, { timestamps: true });

export default mongoose.models.EnergyReading ||
  mongoose.model("EnergyReading", EnergyReadingSchema);
