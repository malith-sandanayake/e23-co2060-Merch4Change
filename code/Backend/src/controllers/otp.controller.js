import jwt from "jsonwebtoken";

import env from "../config/env.js";
import User from "../models/User.js";
import PendingUser from "../models/PendingUser.js";
import { successResponse } from "../utils/apiResponse.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Helper utilities mirrored for token generation
const createToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

const toLoginType = (accountType) => {
  if (accountType === "organization") return "organization";
  if (accountType === "individual") return "user";
  return null;
};

// ==========================================
// ENDPOINT: VERIFY REGISTER OTP
// ==========================================
export const verifyRegisterOtp = asyncHandler(async (req, res) => {
  const { email, otp, otpCode } = req.body;
  const finalOtp = otp || otpCode;

  if (!email || !finalOtp) {
    throw new AppError("Email and OTP code are required.", 400, "VALIDATION_ERROR");
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  // 1. Find the pending registration record
  const pendingUser = await PendingUser.findOne({ email: normalizedEmail });

  if (!pendingUser) {
    throw new AppError(
      "Registration session expired or not found. Please register again.", 
      400, 
      "REGISTRATION_EXPIRED"
    );
  }

  // 2. Verify the OTP code
  if (pendingUser.otpCode !== String(finalOtp).trim()) {
    throw new AppError("Invalid OTP code.", 400, "INVALID_OTP");
  }

  // 3. Move data to the permanent User collection
  let newUser;

  if (pendingUser.accountType === "organization") {
    newUser = await User.create({
      firstName: pendingUser.profileData.orgName,
      lastName: pendingUser.profileData.orgName,
      userName: pendingUser.userName,
      email: pendingUser.email,
      password: pendingUser.password,
      accountType: "organization",
    });

    const { orgName, phone, address, website } = pendingUser.profileData;
    
    // Import OrganizationProfile and Brand if they were missing, but wait, they aren't imported here yet!
    // I need to make sure they are imported at the top of the file.
    // For now, I'll rely on a second replace chunk to add imports.
    const OrganizationProfile = (await import("../models/OrganizationProfile.js")).default;
    const Brand = (await import("../models/Brand.js")).default;

    await OrganizationProfile.create({
      userId: newUser._id,
      orgName,
      phone,
      address,
      website,
    });

    await Brand.create({
      ownerUserId: newUser._id,
      brandName: orgName.trim(),
    });
  } else {
    newUser = await User.create({
      firstName: pendingUser.profileData.firstName,
      lastName: pendingUser.profileData.lastName,
      userName: pendingUser.userName,
      email: pendingUser.email,
      password: pendingUser.password,
      accountType: "individual",
    });
  }

  // 4. Clean up by deleting the pending record
  await PendingUser.deleteOne({ _id: pendingUser._id });

  // 5. Generate JWT token to log them in instantly
  const token = createToken(newUser._id);
  const loginType = toLoginType(newUser.accountType);

  return successResponse(res, 201, "Email verified and account created successfully!", {
    token,
    loginType,
    user: {
      id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
      accountType: newUser.accountType,
    },
  });
});