import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    brandName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    slug: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },
    logoUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
