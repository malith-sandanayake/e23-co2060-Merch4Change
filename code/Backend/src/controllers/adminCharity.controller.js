// code/Backend/controllers/adminCharity.controller.js
import Charity from "../models/Charity.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/v1/admin/charities?status=pending
export const listCharitiesForReview = asyncHandler(async (req, res) => {
  const { status = "pending", page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Charity.find({ verificationStatus: status })
      .populate("ownerUserId", "userName email firstName lastName")
      .sort({ submittedAt: 1 })
      .skip(skip).limit(Number(limit)),
    Charity.countDocuments({ verificationStatus: status }),
  ]);

  res.json({ success: true, data: { items, total, page: Number(page) } });
});

// GET /api/v1/admin/charities/:id
export const getCharityForReview = asyncHandler(async (req, res) => {
  const charity = await Charity.findById(req.params.id)
    .populate("ownerUserId", "userName email firstName lastName");
  if (!charity) throw new AppError("Charity not found.", 404, "CHARITY_NOT_FOUND");
  res.json({ success: true, data: { charity } });
});

// PATCH /api/v1/admin/charities/:id/approve
export const approveCharity = asyncHandler(async (req, res) => {
  const charity = await Charity.findById(req.params.id);
  if (!charity) throw new AppError("Charity not found.", 404, "CHARITY_NOT_FOUND");
  if (charity.verificationStatus === "verified") {
    throw new AppError("Already verified.", 409, "ALREADY_VERIFIED");
  }

  charity.verificationStatus = "verified";
  charity.verifiedAt = new Date();
  charity.verifiedByUserId = req.user._id;
  charity.rejectionReason = "";
  await charity.save();

  // Promote the owner's role + verified flag
  await User.findByIdAndUpdate(charity.ownerUserId, {
    $set: { role: "charity", isVerified: true },
  });

  res.json({ success: true, data: { charity } });
});

// PATCH /api/v1/admin/charities/:id/reject
export const rejectCharity = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!reason || reason.trim().length < 5) {
    throw new AppError("Rejection reason is required (min 5 chars).", 400, "REASON_REQUIRED");
  }

  const charity = await Charity.findById(req.params.id);
  if (!charity) throw new AppError("Charity not found.", 404, "CHARITY_NOT_FOUND");

  charity.verificationStatus = "rejected";
  charity.rejectionReason = reason.trim();
  charity.verifiedAt = null;
  charity.verifiedByUserId = req.user._id;
  await charity.save();

  res.json({ success: true, data: { charity } });
});
