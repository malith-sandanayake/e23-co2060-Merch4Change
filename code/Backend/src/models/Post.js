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
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    images: [{ type: String }
    ],
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
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

// updated for post creation 