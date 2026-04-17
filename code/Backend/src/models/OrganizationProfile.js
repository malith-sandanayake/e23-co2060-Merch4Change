import mongoose from "mongoose";

const organizationProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    orgName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const OrganizationProfile = mongoose.model("OrganizationProfile", organizationProfileSchema);

export default OrganizationProfile;
