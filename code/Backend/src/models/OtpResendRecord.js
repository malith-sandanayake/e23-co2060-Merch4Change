import mongoose from "mongoose";

const otpResendRecordSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  lastRequestAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 28800, // 8 hours in seconds (8 * 60 * 60)
  },
});

export default mongoose.model("OtpResendRecord", otpResendRecordSchema);
