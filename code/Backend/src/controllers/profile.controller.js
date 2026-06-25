import { successResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import CoinTransaction from "../models/CoinTransaction.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
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

export const getProfileByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ userName: username });
  if (!user) {
    throw new AppError("User not found.", 404, "USER_NOT_FOUND");
  }

  // Check if current user is following this user
  let isFollowing = false;
  if (req.user) {
    const followRecord = await Follow.findOne({
      followerId: req.user._id,
      followingId: user._id,
    });
    isFollowing = !!followRecord;
  }

  return successResponse(res, 200, "User profile fetched successfully.", {
    user,
    isFollowing,
  });
});

export const followUser = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const userToFollow = await User.findOne({ userName: username });
  if (!userToFollow) {
    throw new AppError("User not found.", 404, "USER_NOT_FOUND");
  }

  if (String(userToFollow._id) === String(req.user._id)) {
    throw new AppError("You cannot follow yourself.", 400, "SELF_FOLLOW_FORBIDDEN");
  }

  // Find or create follow record
  const existingFollow = await Follow.findOne({
    followerId: req.user._id,
    followingId: userToFollow._id,
  });

  if (existingFollow) {
    return successResponse(res, 200, "Already following this user.", { isFollowing: true });
  }

  await Follow.create({
    followerId: req.user._id,
    followingId: userToFollow._id,
  });

  return successResponse(res, 200, "Successfully followed user.", { isFollowing: true });
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const userToUnfollow = await User.findOne({ userName: username });
  if (!userToUnfollow) {
    throw new AppError("User not found.", 404, "USER_NOT_FOUND");
  }

  await Follow.findOneAndDelete({
    followerId: req.user._id,
    followingId: userToUnfollow._id,
  });

  return successResponse(res, 200, "Successfully unfollowed user.", { isFollowing: false });
});