import mongoose from "mongoose";

const FeederSchema = new mongoose.Schema({
  name: String,
  location: String,
}, { timestamps: true });

export default mongoose.models.Feeder || mongoose.model("Feeder", FeederSchema);
