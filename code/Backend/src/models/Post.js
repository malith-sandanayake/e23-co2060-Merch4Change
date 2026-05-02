import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20000,
    },
    likesCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

// Middleware: Increment count when post is created
postSchema.post("save", async function () {
  const User = mongoose.model("User");
  await User.findByIdAndUpdate(this.userId, { $inc: { postsCount: 1 } });
});

// Middleware: Decrement count when post is deleted
postSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const User = mongoose.model("User");
    await User.findByIdAndUpdate(doc.userId, { $inc: { postsCount: -1 } });
  }
});

const Post = mongoose.model("Post", postSchema);
export default Post;