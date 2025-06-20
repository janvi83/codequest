import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  browser: { type: String },
  os: { type: String },
  device: { type: String },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("LoginHistory", loginHistorySchema);