import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participantKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessageText: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },
    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },
    lastSenderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;