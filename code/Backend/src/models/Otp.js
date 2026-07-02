import mongoose from "mongoose";

const otpExpire = process.env.OTP_EXPIRE_MIN || 5;

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * otpExpire,
  }, // auto-delete after OTP_EXPIRE_MIN minutes
});

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
