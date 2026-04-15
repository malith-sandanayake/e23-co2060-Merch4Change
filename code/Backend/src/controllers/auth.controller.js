import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import User from "../models/User.js";
import { successResponse } from "../utils/apiResponse.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createUserProfile,
  createOrganizationProfile,
} from "../constructors/profile.creator.js";

const SUPPORTED_ACCOUNT_TYPES = ["individual", "organization"];

const normalizeAccountType = (accountType) => {
  if (typeof accountType !== "string") {
    return accountType;
  }

  const normalized = accountType.toLowerCase().trim();

  if (["user"].includes(normalized)) {
    return "individual";
  }

  if (["organization"].includes(normalized)) {
    return "organization";
  }

  return normalized;
};

const toLoginType = (accountType) => {
  if (accountType === "organization") {
    return "organization";
  }

  if (accountType === "individual") {
    return "user";
  }

  return null;
};

const createToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

export const register = asyncHandler(async (req, res) => {
  const requestBody = req.body;

  if (!requestBody.accountType) {
    throw new AppError("accountType is required.", 400, "VALIDATION_ERROR");
  }

  const normalizedAccountType = normalizeAccountType(requestBody.accountType);

  if (!SUPPORTED_ACCOUNT_TYPES.includes(normalizedAccountType)) {
    throw new AppError(
      `Unsupported accountType. Supported types are: ${SUPPORTED_ACCOUNT_TYPES.join(", ")}.`,
      400,
      "VALIDATION_ERROR",
    );
  }

  if (normalizedAccountType === "individual") {
    console.log("validation done");
    return await createUserProfile(req, res);
  }
  if (normalizedAccountType === "organization") {
    return await createOrganizationProfile(req, res);
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = String(email).toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );

  if (!user) {
    throw new AppError("Invalid credentials.", 401, "INVALID_CREDENTIALS");
  }

  const accountType = user.accountType;

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials.", 401, "INVALID_CREDENTIALS");
  }

  const loginType = toLoginType(accountType);

  if (!loginType) {
    throw new AppError(
      "Invalid account type for user.",
      403,
      "INVALID_ACCOUNT_TYPE",
    );
  }

  const token = createToken(user._id);

  return successResponse(res, 200, "Login successful.", {
    token,
    loginType,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      accountType: user.accountType,
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  return successResponse(res, 200, "Current user fetched successfully.", {
    user: req.user,
  });
});
