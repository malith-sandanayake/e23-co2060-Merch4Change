import Charity from "../models/Charity.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

export const submitVerification = asyncHandler(async (req, res) => {
  if (req.user.accountType !== "organization") {
    throw new AppError(
      "Only organization accounts can submit charity verification.",
      403,
      "FORBIDDEN",
    );
  }

  const existing = await Charity.findOne({ ownerUserId: req.user._id });
  if (existing?.verificationStatus === "pending") {
    throw new AppError("Your verification is already under review.", 409, "ALREADY_PENDING");
  }
  if (existing?.verificationStatus === "verified") {
    throw new AppError("Your organization is already verified.", 409, "ALREADY_VERIFIED");
  }

  const {
    publicName,
    legalName,
    description,
    logoUrl,
    contactEmail,
    website,
    registrationNumber,
    category,
    country,
    address,
    proofDocuments,
  } = req.body;

  const update = {
    ownerUserId: req.user._id,
    publicName,
    legalName,
    description,
    logoUrl,
    contactEmail,
    website,
    registrationNumber,
    category,
    country,
    address,
    proofDocuments,
    verificationStatus: "pending",
    submittedAt: new Date(),
    rejectionReason: "",
    verifiedAt: null,
    verifiedByUserId: null,
  };

  const charity = await Charity.findOneAndUpdate(
    { ownerUserId: req.user._id },
    { $set: update },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
  );

  return successResponse(res, 200, "Verification submitted successfully.", { charity });
});

export const getMyCharity = asyncHandler(async (req, res) => {
  const charity = await Charity.findOne({ ownerUserId: req.user._id });
  return successResponse(res, 200, "Charity record fetched successfully.", { charity });
});

export const listVerifiedCharities = asyncHandler(async (req, res) => {
  const { category, q, page = 1, limit = 20 } = req.query;
  const filter = { verificationStatus: "verified" };
  if (category) filter.category = category;
  if (q) filter.publicName = { $regex: q, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Charity.find(filter)
      .select("publicName description logoUrl category website ownerUserId")
      .populate("ownerUserId", "userName")
      .skip(skip)
      .limit(Number(limit))
      .sort({ verifiedAt: -1 }),
    Charity.countDocuments(filter),
  ]);

  return successResponse(res, 200, "Verified charities fetched successfully.", {
    items,
    total,
    page: Number(page),
  });
});

export const uploadProofDocument = asyncHandler(async (req, res) => {
  if (req.user.accountType !== "organization") {
    throw new AppError("Only organization accounts can upload proof documents.", 403, "FORBIDDEN");
  }

  if (!req.file) {
    throw new AppError("No file uploaded.", 400, "VALIDATION_ERROR");
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, "charity-proofs");
  const label = String(req.body?.label ?? req.file.originalname ?? "Document").trim();

  return successResponse(res, 200, "Document uploaded successfully.", {
    label,
    url: result.secure_url,
  });
});
