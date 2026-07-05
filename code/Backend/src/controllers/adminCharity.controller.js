import Charity from "../models/Charity.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const listCharitiesForReview = asyncHandler(async (req, res) => {
  const { status = "pending", page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Charity.find({ verificationStatus: status })
      .populate("ownerUserId", "userName email firstName lastName")
      .sort({ submittedAt: 1 })
      .skip(skip)
      .limit(Number(limit)),
    Charity.countDocuments({ verificationStatus: status }),
  ]);

  return successResponse(res, 200, "Charities fetched for review.", {
    items,
    total,
    page: Number(page),
  });
});

export const getCharityForReview = asyncHandler(async (req, res) => {
  const charity = await Charity.findById(req.params.id)
    .populate("ownerUserId", "userName email firstName lastName");
  if (!charity) throw new AppError("Charity not found.", 404, "CHARITY_NOT_FOUND");
  return successResponse(res, 200, "Charity fetched successfully.", { charity });
});

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

  await User.findByIdAndUpdate(charity.ownerUserId, {
    $set: { role: "charity", isVerified: true },
  });

  await Notification.create({
    userId: charity.ownerUserId,
    type: "CharityVerification",
    message: "Your organization has been verified. You can now receive donations on Merch4Change.",
  });

  return successResponse(res, 200, "Charity approved successfully.", { charity });
});

export const rejectCharity = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const charity = await Charity.findById(req.params.id);
  if (!charity) throw new AppError("Charity not found.", 404, "CHARITY_NOT_FOUND");

  charity.verificationStatus = "rejected";
  charity.rejectionReason = reason;
  charity.verifiedAt = null;
  charity.verifiedByUserId = req.user._id;
  await charity.save();

  await Notification.create({
    userId: charity.ownerUserId,
    type: "CharityVerification",
    message: `Your verification was rejected: ${reason}`,
  });

  return successResponse(res, 200, "Charity rejected successfully.", { charity });
});
