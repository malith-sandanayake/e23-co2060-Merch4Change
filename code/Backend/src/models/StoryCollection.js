import mongoose from "mongoose";

const storyCollectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    stories: [
      {
        image: { type: String, required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const StoryCollection = mongoose.model("StoryCollection", storyCollectionSchema);
export default StoryCollection;
