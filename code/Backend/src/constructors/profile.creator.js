import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import Brand from "../models/Brand.js";
import Charity from "../models/Charity.js";
import OrganizationProfile from "../models/OrganizationProfile.js";
import User from "../models/User.js";

const CHARITY_ORG_TYPES = new Set(["NGO", "Charity"]);

const isCharityIntent = (orgType) => CHARITY_ORG_TYPES.has(String(orgType ?? "").trim());
import { successResponse } from "../utils/apiResponse.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

const createToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

export const createUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;
  const normalizedEmail = String(email).toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  const existingUserName = await User.findOne({ userName: userName.trim() });

  if (existingUser) {
    throw new AppError("Email is already in use.", 409, "EMAIL_ALREADY_IN_USE");
  }

  if (existingUserName) {
    throw new AppError("Username is already in use.", 409, "USERNAME_ALREADY_IN_USE");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await User.create({
      firstName,
      lastName,
      userName,
      email: normalizedEmail,
      password: hashedPassword,
      accountType: "individual",
    });


  const token = createToken(createdUser._id);

  return successResponse(res, 201, "User profile created successfully.", {
    token,
    user: {
      id: createdUser._id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      userName: createdUser.userName,
      email: createdUser.email,
      accountType: createdUser.accountType,
      role: createdUser.role,
      isVerified: createdUser.isVerified,
    },
  });
});

export const createOrganizationProfile = asyncHandler(async (req, res) => {
  const {
    orgName,
    email,
    password,
    phone,
    address,
    website,
    orgType,
    country,
    registrationNumber,
  } = req.body;
  const charityIntent = isCharityIntent(orgType);
  const normalizedEmail = String(email).toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  const existingOrgName = await OrganizationProfile.findOne({ orgName: orgName.trim() });

  if (existingOrgName) {
    throw new AppError("Organization name is already in use.", 409, "ORGNAME_ALREADY_IN_USE");
  }

  if (existingUser) {
    throw new AppError("Email is already in use.", 409, "EMAIL_ALREADY_IN_USE");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await User.create({
      firstName: orgName,
      lastName: orgName,
      userName: orgName.trim().toLowerCase().replace(/\s+/g, ""),
      email: normalizedEmail,
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

  if (charityIntent) {
    await Charity.create({
      ownerUserId: createdUser._id,
      publicName: orgName.trim(),
      country: String(country ?? "").trim(),
      address: String(address ?? "").trim(),
      website: String(website ?? "").trim(),
      contactEmail: normalizedEmail,
      registrationNumber: String(registrationNumber ?? "").trim(),
      verificationStatus: "unsubmitted",
    });
  } else {
    await Brand.create({
      ownerUserId: createdUser._id,
      brandName: orgName.trim(),
    });
  }

  const token = createToken(createdUser._id);

  return successResponse(res, 201, "Organization profile created successfully.", {
    token,
    user: {
      id: createdUser._id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      userName: createdUser.userName,
      email: createdUser.email,
      accountType: createdUser.accountType,
      role: createdUser.role,
      isVerified: createdUser.isVerified,
    },
    profile: {
      id: createdProfile._id,
      orgName: createdProfile.orgName,
      phone: createdProfile.phone,
      address: createdProfile.address,
      website: createdProfile.website,
      createdAt: createdProfile.createdAt,
    },
    charityIntent,
  });
});