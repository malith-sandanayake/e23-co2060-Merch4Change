import mongoose from "mongoose";

const userBadgeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    badgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
      required: true,
      index: true,
    },
    earnedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

userBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

const UserBadge = mongoose.model("UserBadge", userBadgeSchema);

export default UserBadge;
