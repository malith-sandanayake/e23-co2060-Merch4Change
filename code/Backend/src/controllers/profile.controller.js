import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import OrganizationProfile from "../models/OrganizationProfile.js";
import User from "../models/User.js";
import { successResponse } from "../utils/apiResponse.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

const createToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

export const createOrganizationProfile = asyncHandler(async (req, res) => {
  const { orgName, email, password, phone, address, website } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email is already in use.", 409, "EMAIL_ALREADY_IN_USE");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await User.create({
    fullName: orgName,
    email,
    password: hashedPassword,
    accountType: "organization",
  });

  const createdProfile = await OrganizationProfile.create({
    userId: createdUser._id,
    orgName,
    phone,
    address,
    website,
  });

  const token = createToken(createdUser._id);

  return successResponse(res, 201, "Organization profile created successfully.", {
    token,
    user: {
      id: createdUser._id,
      fullName: createdUser.fullName,
      email: createdUser.email,
      accountType: createdUser.accountType,
    },
    profile: {
      id: createdProfile._id,
      orgName: createdProfile.orgName,
      phone: createdProfile.phone,
      address: createdProfile.address,
      website: createdProfile.website,
      createdAt: createdProfile.createdAt,
    },
  });
});

export const getOrganizationProfile = asyncHandler(async (req, res) => {
  const profile = await OrganizationProfile.findOne({ userId: req.user._id });

  if (!profile) {
    throw new AppError("Organization profile not found.", 404, "PROFILE_NOT_FOUND");
  }

  return successResponse(res, 200, "Organization profile fetched successfully.", {
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      accountType: req.user.accountType,
    },
    profile: {
      id: profile._id,
      orgName: profile.orgName,
      phone: profile.phone,
      address: profile.address,
      website: profile.website,
      createdAt: profile.createdAt,
    },
  });
});
