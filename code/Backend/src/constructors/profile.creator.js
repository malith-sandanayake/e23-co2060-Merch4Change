import bcrypt from "bcryptjs";
import crypto from "crypto";

import PendingUser from "../models/PendingUser.js";
import User from "../models/User.js";
import OrganizationProfile from "../models/OrganizationProfile.js";
import { successResponse } from "../utils/apiResponse.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendOtpEmail from "../utils/sendOtpEmail.js";

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
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

  // Delete any existing pending registration for this email (handles re-registration)
  await PendingUser.deleteOne({ email: normalizedEmail });

  const hashedPassword = await bcrypt.hash(password, 10);
  const otpCode = generateOTP();

  try {
    await PendingUser.create({
      email: normalizedEmail,
      password: hashedPassword,
      userName: userName.trim(),
      accountType: "individual",
      otpCode,
      profileData: {
        firstName,
        lastName
      }
    });
  } catch (dbError) {
    console.error("[PendingUser.create] Failed to save pending user record:", dbError.message, dbError);
    throw new AppError("Failed to initiate registration. Please try again.", 500, "DB_ERROR");
  }

  console.log(`\n[DEV MODE] OTP for ${normalizedEmail} is: ${otpCode}\n`);
  try {
    await sendOtpEmail(normalizedEmail, otpCode);
  } catch (error) {
    console.error("Failed to send OTP email:", error.message);
  }

  return successResponse(res, 200, "Verification code sent to your email. Please verify to complete registration.");
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
  const normalizedEmail = String(email).toLowerCase().trim();
  const userName = orgName.trim().toLowerCase().replace(/\s+/g, "");

  const existingUser = await User.findOne({ email: normalizedEmail });
  const existingOrgName = await OrganizationProfile.findOne({ orgName: orgName.trim() });
  const existingUserName = await User.findOne({ userName });

  if (existingOrgName) {
    throw new AppError("Organization name is already in use.", 409, "ORGNAME_ALREADY_IN_USE");
  }

  if (existingUser) {
    throw new AppError("Email is already in use.", 409, "EMAIL_ALREADY_IN_USE");
  }

  if (existingUserName) {
    throw new AppError("Username generated from organization name is already in use.", 409, "USERNAME_ALREADY_IN_USE");
  }

  // Delete any existing pending registration for this email (handles re-registration)
  await PendingUser.deleteOne({ email: normalizedEmail });

  const hashedPassword = await bcrypt.hash(password, 10);
  const otpCode = generateOTP();

  try {
    await PendingUser.create({
      email: normalizedEmail,
      password: hashedPassword,
      userName,
      accountType: "organization",
      otpCode,
      profileData: {
        orgName,
        phone,
        address,
        website,
        orgType,
        country,
        registrationNumber
      }
    });
  } catch (dbError) {
    console.error("[PendingUser.create] Failed to save pending org record:", dbError.message, dbError);
    throw new AppError("Failed to initiate registration. Please try again.", 500, "DB_ERROR");
  }

  console.log(`\n[DEV MODE] OTP for ${normalizedEmail} is: ${otpCode}\n`);
  try {
    await sendOtpEmail(normalizedEmail, otpCode);
  } catch (error) {
    console.error("Failed to send OTP email:", error.message);
  }

  return successResponse(res, 200, "Verification code sent to your email. Please verify to complete registration.");
});