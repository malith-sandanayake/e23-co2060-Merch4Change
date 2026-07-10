import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/apiResponse.js";
import User from "../models/User.js";
import Charity from "../models/Charity.js";
import Project from "../models/Project.js";

/**
 * Get organization profile by username
 */
export const getOrgProfileByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ userName: username });
  if (!user) {
    throw new AppError("Organization not found.", 404);
  }

  const charity = await Charity.findOne({ ownerUserId: user._id });
  if (!charity) {
    throw new AppError("Charity profile not found for this organization.", 404);
  }

  const projects = await Project.find({ charityId: charity._id });

  const data = {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      role: user.role,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      profileBio: user.profileBio,
      profileImage: user.profileImage,
    },
    charity: {
      id: charity._id,
      publicName: charity.publicName,
      description: charity.description,
      logoUrl: charity.logoUrl,
      website: charity.website,
      contactEmail: charity.contactEmail,
      verificationStatus: charity.verificationStatus,
      rejectionReason: charity.rejectionReason,
      registrationNumber: charity.registrationNumber,
      category: charity.category,
    },
    projects: projects.map((p) => ({
      id: p._id,
      title: p.title,
      description: p.description,
      goalAmount: p.goalAmount,
      collectedAmount: p.collectedAmount,
      status: p.status,
    })),
  };

  return successResponse(res, 200, "Organization profile fetched successfully.", data);
});

/**
 * Add a new project for the organization
 */
export const addProject = asyncHandler(async (req, res) => {
  if (req.user.accountType !== "organization") {
    throw new AppError("Only organization accounts can create projects.", 403, "FORBIDDEN");
  }

  const charity = await Charity.findOne({ ownerUserId: req.user._id });
  
  if (!charity) {
    throw new AppError("You must complete your charity profile verification before adding projects.", 403, "CHARITY_PROFILE_REQUIRED");
  }

  if (charity.verificationStatus !== "verified") {
    throw new AppError("Your organization must be verified by an admin to add projects.", 403, "NOT_VERIFIED");
  }

  const { title, description, goalAmount } = req.body;

  if (!title || !description || !goalAmount) {
    throw new AppError("Title, description, and goal amount are required.", 400, "VALIDATION_ERROR");
  }

  const project = await Project.create({
    charityId: charity._id,
    title: title.trim(),
    description: description.trim(),
    goalAmount: Number(goalAmount),
    collectedAmount: 0,
    status: "active"
  });

  const formattedProject = {
    id: project._id,
    title: project.title,
    description: project.description,
    goalAmount: project.goalAmount,
    collectedAmount: project.collectedAmount,
    status: project.status
  };

  return successResponse(res, 201, "Project created successfully.", { project: formattedProject });
});

export default {
  getOrgProfileByUsername,
  addProject,
};
