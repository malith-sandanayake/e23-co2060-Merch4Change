// code/Backend/models/Charity.js
import mongoose from "mongoose";

const proofDocumentSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 120 },
    url: { type: String, required: true, trim: true, maxlength: 1000 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const charitySchema = new mongoose.Schema(
  {
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    publicName: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
    legalName:  { type: String, trim: true, maxlength: 200, default: "" },
    description:{ type: String, trim: true, maxlength: 10000, default: "" },
    logoUrl:    { type: String, trim: true, maxlength: 500, default: "" },
    contactEmail:{ type: String, trim: true, lowercase: true, maxlength: 254, default: "" },
    website:    { type: String, trim: true, maxlength: 300, default: "" },

    // --- Verification fields ---
    registrationNumber: { type: String, trim: true, maxlength: 100, default: "" },
    category: {
      type: String,
      enum: ["health", "education", "environment", "humanitarian", "animal", "other"],
      default: "other",
    },
    country:  { type: String, trim: true, maxlength: 100, default: "" },
    address:  { type: String, trim: true, maxlength: 500, default: "" },
    proofDocuments: { type: [proofDocumentSchema], default: [] },

    verificationStatus: {
      type: String,
      enum: ["unsubmitted", "pending", "verified", "rejected"],
      default: "unsubmitted",
      index: true,
    },
    submittedAt:        { type: Date, default: null },
    verifiedAt:         { type: Date, default: null },
    verifiedByUserId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    rejectionReason:    { type: String, trim: true, maxlength: 1000, default: "" },
  },
  { timestamps: true, versionKey: false },
);

const Charity = mongoose.model("Charity", charitySchema);
export default Charity;
