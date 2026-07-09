import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/apiResponse.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";
import Story from "../models/Story.js";

// @desc    Upload a new story
// @route   POST /api/v1/stories
// @access  Private
export const uploadStory = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("No file uploaded", 400, "VALIDATION_ERROR");
  }

  // Upload image to cloudinary
  const uploadResult = await uploadBufferToCloudinary(
    req.file.buffer,
    "merch4change/stories"
  );

  const newStory = await Story.create({
    userId: req.user._id,
    image: uploadResult.secure_url,
  });

  return successResponse(res, 201, "Story uploaded successfully", {
    story: newStory,
  });
});

// @desc    Get recent stories
// @route   GET /api/v1/stories
// @access  Private
export const getStories = asyncHandler(async (req, res) => {
  // TTL index already removes stories older than 24h. 
  // We just fetch all stories and populate user details.
  // In a real app, you might want to only fetch stories from friends/following.
  const stories = await Story.find({})
    .populate("userId", "firstName lastName profileImageUrl accountType")
    .sort({ createdAt: -1 });

  return successResponse(res, 200, "Stories retrieved successfully", {
    stories,
  });
});
