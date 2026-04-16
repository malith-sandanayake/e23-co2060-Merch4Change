import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    charityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 250,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    goalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    collectedAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
