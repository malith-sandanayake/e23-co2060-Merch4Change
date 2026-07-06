import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true }, // Hashed password
  userName: { type: String, required: true },
  accountType: { type: String, required: true },
  otpCode: { type: String, required: true },
  profileData: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now, expires: 900 }, // Auto-deletes after 15 minutes
});

export default mongoose.model("PendingUser", pendingUserSchema);

// pending user uses before the otp vertification process. If verification succeeded, copy the data to the user model and delete the pendingUser model