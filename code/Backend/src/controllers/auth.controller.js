import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const createToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, accountType } = req.body;

  if (!fullName || !email || !password) {
    const error = new Error("fullName, email and password are required.");
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error("Password must be at least 8 characters.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error("Email is already in use.");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email: normalizedEmail,
    password: hashedPassword,
    accountType,
  });

  const token = createToken(user._id);

  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    data: {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountType: user.accountType,
      },
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("email and password are required.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    const error = new Error("Invalid credentials.");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid credentials.");
    error.statusCode = 401;
    throw error;
  }

  const token = createToken(user._id);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountType: user.accountType,
      },
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});
