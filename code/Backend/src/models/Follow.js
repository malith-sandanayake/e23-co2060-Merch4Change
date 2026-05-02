import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Middleware: Update User Stats on Follow
followSchema.post("save", async function () {
  const User = mongoose.model("User");
  // The person who followed gains 1 'following'
  await User.findByIdAndUpdate(this.followerId, { $inc: { followingCount: 1 } });
  // The person being followed gains 1 'follower'
  await User.findByIdAndUpdate(this.followingId, { $inc: { followersCount: 1 } });
});

// Middleware: Update User Stats on Unfollow
followSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const User = mongoose.model("User");
    await User.findByIdAndUpdate(doc.followerId, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(doc.followingId, { $inc: { followersCount: -1 } });
  }
});

const Follow = mongoose.model("Follow", followSchema);
export default Follow;