// code/Backend/controllers/charity.controller.js
import Charity from "../models/Charity.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

// POST /api/v1/charities/verify  (create or update own charity + submit for review)
export const submitVerification = asyncHandler(async (req, res) => {
  const {
    publicName, legalName, description, logoUrl, contactEmail, website,
    registrationNumber, category, country, address, proofDocuments = [],
  } = req.body;

  if (!publicName || !registrationNumber || proofDocuments.length === 0) {
    throw new AppError(
      "publicName, registrationNumber and at least one proof document are required.",
      400, "VALIDATION_FAILED",
    );
  }

  const update = {
    ownerUserId: req.user._id,
    publicName, legalName, description, logoUrl, contactEmail, website,
    registrationNumber, category, country, address, proofDocuments,
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

  res.status(200).json({ success: true, data: { charity } });
});

// GET /api/v1/charities/me
export const getMyCharity = asyncHandler(async (req, res) => {
  const charity = await Charity.findOne({ ownerUserId: req.user._id });
  res.json({ success: true, data: { charity } });
});

// GET /api/v1/charities  (public — only verified)
export const listVerifiedCharities = asyncHandler(async (req, res) => {
  const { category, q, page = 1, limit = 20 } = req.query;
  const filter = { verificationStatus: "verified" };
  if (category) filter.category = category;
  if (q) filter.publicName = { $regex: q, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Charity.find(filter)
      .select("publicName description logoUrl category website")
      .skip(skip).limit(Number(limit)).sort({ verifiedAt: -1 }),
    Charity.countDocuments(filter),
  ]);

  res.json({ success: true, data: { items, total, page: Number(page) } });
});
