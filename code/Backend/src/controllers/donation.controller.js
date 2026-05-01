import Charity from "../models/Charity.js";
import CoinTransaction from "../models/CoinTransaction.js";
import Donation from "../models/Donation.js";
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

  const user = await User.findById(req.user._id);
  if (user.coinBalance < coinAmount) {
    throw new AppError("Insufficient coin balance.", 400, "INSUFFICIENT_COINS");
  }

  // Deduct coins
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

  return successResponse(res, 201, "Donation successful.", { donation });
});

export const listCharities = asyncHandler(async (req, res) => {
  const charities = await Charity.find({ verificationStatus: "verified" })
    .select("publicName description logoUrl website");

  return successResponse(res, 200, "Charities fetched successfully.", { charities });
});