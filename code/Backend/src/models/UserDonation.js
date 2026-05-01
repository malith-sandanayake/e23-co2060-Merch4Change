import mongoose from "mongoose";

const userDonationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    charity: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 100,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed"],
      default: "processing",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserDonation = mongoose.model("UserDonation", userDonationSchema);

export default UserDonation;
