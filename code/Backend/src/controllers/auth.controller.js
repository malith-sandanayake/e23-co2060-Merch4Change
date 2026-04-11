import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import User from "../models/User.js";
import { successResponse } from "../utils/apiResponse.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

const createToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, fullName, email, password, accountType, username } = req.body;

  const normalizedEmail = String(email).toLowerCase().trim();
  const normalizedUsername =
    typeof username === "string" && username.trim() ? username.toLowerCase().trim() : undefined;

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError("Email is already in use.", 409, "EMAIL_ALREADY_IN_USE");
  }

  if (normalizedUsername) {
    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      throw new AppError("Username is already in use.", 409, "USERNAME_ALREADY_IN_USE");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    fullName,
    email: normalizedEmail,
    username: normalizedUsername,
    password: hashedPassword,
    accountType,
  });

  const token = createToken(user._id);

  return successResponse(res, 201, "User registered successfully.", {
    token,
    user: {
      id: user._id,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      fullName: user.fullName,
      email: user.email,
      username: user.username || null,
      accountType: user.accountType,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = String(email).toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials.", 401, "INVALID_CREDENTIALS");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials.", 401, "INVALID_CREDENTIALS");
  }

  const token = createToken(user._id);

  return successResponse(res, 200, "Login successful.", {
    token,
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
