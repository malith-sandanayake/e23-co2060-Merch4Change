import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400, // 24 hours TTL index
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const Story = mongoose.model("Story", storySchema);
export default Story;
