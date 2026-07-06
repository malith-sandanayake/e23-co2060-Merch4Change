import Charity from "../models/Charity.js";
import CoinTransaction from "../models/CoinTransaction.js";
import Donation from "../models/Donation.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const createDonation = asyncHandler(async (req, res) => {
  const { charityId, coinAmount } = req.body;

  if (!charityId || !coinAmount || coinAmount < 1) {
    throw new AppError("charityId and coinAmount (min 1) are required.", 400, "VALIDATION_ERROR");
  }

  const charity = await Charity.findById(charityId);
  if (!charity) {
    throw new AppError("Charity not found.", 404, "CHARITY_NOT_FOUND");
  }
  if (charity.verificationStatus !== "verified") {
    throw new AppError("Donations are only accepted for verified charities.", 403, "CHARITY_NOT_VERIFIED");
  }

  const user = await User.findById(req.user._id);
  if (user.coinBalance < coinAmount) {
    throw new AppError("Insufficient coin balance.", 400, "INSUFFICIENT_COINS");
  }

  await User.findByIdAndUpdate(req.user._id, { $inc: { coinBalance: -coinAmount } });

  const donation = await Donation.create({
    donorUserId: req.user._id,
    charityId,
    coinAmount,
  });

  await CoinTransaction.create({
    userId: req.user._id,
    type: "donate",
    amount: coinAmount,
    refType: "donation",
    refId: donation._id,
  });

  const updatedUser = await User.findById(req.user._id);

  return successResponse(res, 201, "Donation successful.", {
    donation,
    coinBalance: updatedUser.coinBalance,
  });
});

export const listCharities = asyncHandler(async (req, res) => {
  const charities = await Charity.find({ verificationStatus: "verified" })
    .select("publicName description logoUrl website category ownerUserId")
    .populate("ownerUserId", "userName")
    .sort({ verifiedAt: -1 });

  return successResponse(res, 200, "Charities fetched successfully.", { charities });
});

export const listDonationProjects = asyncHandler(async (req, res) => {
  const verifiedCharityIds = await Charity.find({ verificationStatus: "verified" }).distinct("_id");

  const projects = await Project.find({
    charityId: { $in: verifiedCharityIds },
    status: "active",
  })
    .populate({ path: "charityId", select: "publicName" })
    .sort({ createdAt: -1 });

  return successResponse(res, 200, "Projects fetched successfully.", {
    projects: projects.map((project) => ({
      id: project._id,
      charityId: project.charityId?._id,
      charityName: project.charityId?.publicName,
      title: project.title,
      description: project.description,
      goalAmount: project.goalAmount,
      collectedAmount: project.collectedAmount,
      status: project.status,
    })),
  });
});
