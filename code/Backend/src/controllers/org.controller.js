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

export default {
  getOrgProfileByUsername,
};
