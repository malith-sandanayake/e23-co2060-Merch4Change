import { successResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import CoinTransaction from "../models/CoinTransaction.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";

export const me = asyncHandler(async (req, res) => {
  return successResponse(res, 200, "Current user fetched successfully.", {
    user: req.user,
  });
});

export const getMyCoins = asyncHandler(async (req, res) => {
  const transactions = await CoinTransaction.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);

  return successResponse(res, 200, "Coin data fetched successfully.", {
    coinBalance: req.user.coinBalance ?? 0,
    transactions,
  });
});

export const updateMe = asyncHandler(async (req, res) => {
  const payload = req.body || {};

  // Only allow certain fields to be updated
  const allowed = ["firstName", "lastName", "userName", "email", "profileBio", "userLink"];
  const updateData = {};
  for (const k of allowed) {
    if (Object.prototype.hasOwnProperty.call(payload, k)) updateData[k] = payload[k];
  }

  // If username or email is changing, ensure uniqueness
  if (updateData.userName && updateData.userName !== req.user.userName) {
    const exists = await User.findOne({ userName: updateData.userName, _id: { $ne: req.user._id } });
    if (exists) throw new AppError("Username already taken.", 409, "USERNAME_TAKEN");
  }

  if (updateData.email && updateData.email !== req.user.email) {
    const exists = await User.findOne({ email: updateData.email.toLowerCase(), _id: { $ne: req.user._id } });
    if (exists) throw new AppError("Email already in use.", 409, "EMAIL_TAKEN");
    updateData.email = updateData.email.toLowerCase();
  }

  Object.assign(req.user, updateData);
  await req.user.save();

  return successResponse(res, 200, "Profile updated successfully.", {
    user: req.user,
  });
});