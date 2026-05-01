import { successResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import CoinTransaction from "../models/CoinTransaction.js";

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