import { successResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import StoryCollection from "../models/StoryCollection.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";

// @desc    Get user's story collections
// @route   GET /api/v1/collections/:username
// @access  Private
export const getUserCollections = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ userName: username });
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  const collections = await StoryCollection.find({ userId: user._id }).sort({ createdAt: -1 });

  return successResponse(res, 200, "Collections fetched successfully", { collections });
});

// @desc    Create a new story collection
// @route   POST /api/v1/collections
// @access  Private
export const createCollection = asyncHandler(async (req, res) => {
  const { title, image } = req.body;

  if (!title) {
    throw new AppError("Collection title is required", 400, "MISSING_TITLE");
  }

  const newCollection = new StoryCollection({
    userId: req.user._id,
    title,
    stories: image ? [{ image }] : [],
  });

  await newCollection.save();

  return successResponse(res, 201, "Collection created successfully", { collection: newCollection });
});

// @desc    Add a story to an existing collection
// @route   PUT /api/v1/collections/:id/save
// @access  Private
export const saveStoryToCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;

  if (!image) {
    throw new AppError("Story image is required", 400, "MISSING_IMAGE");
  }

  const collection = await StoryCollection.findOne({ _id: id, userId: req.user._id });
  
  if (!collection) {
    throw new AppError("Collection not found or unauthorized", 404, "COLLECTION_NOT_FOUND");
  }

  // Check if image already exists in collection
  const alreadySaved = collection.stories.some(s => s.image === image);
  if (!alreadySaved) {
    collection.stories.push({ image });
    await collection.save();
  }

  return successResponse(res, 200, "Story saved to collection", { collection });
});
