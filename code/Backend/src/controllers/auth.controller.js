import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ms from "ms"; // millisecond convertor

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
const USERNAME_FORMAT = /^[a-zA-Z0-9._-]{2,30}$/;
// naming must be 2-30 characters only contains: letters, numbers, dots, hyphens, underscores

// 1. normalization: fix the frontend data inconsistency with the backend
const normalizeAccountType = (accountType) => {
  if (typeof accountType !== "string") {
    return accountType;
    // accountType comes from req.body.accountType
    // prevent crashing trying to do string manipulation funcs on non-strings
  }

  // if frontend send data as 'user' instead of 'individual', use it as a 'individual'
  const normalized = accountType.toLowerCase().trim();
  if (["user"].includes(normalized)) {
    return "individual";
  }

  // get the accountType -> lowercase -> trim -> result
  // result == 'individual'?
  if (["individual"].includes(normalized)) {
    return "individual";
  }

  if (["organization"].includes(normalized)) {
    return "organization";
  }

  return normalized;
};

// 2. opposite translation of the normalization
// fix the backend data inconsistency with the frontend: when data send to frontend, from backend
const toLoginType = (accountType) => {
  if (accountType === "organization") {
    return "organization";
  }

  if (accountType === "individual") {
    return "user";
  }

  return null;
};

// 3. create tokens
// AccessToken: use for authenticate via endpoints
const createAccessToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

// RefreshToken: use to get a new accessToken
const createRefreshToken = (userId) => {
  return jwt.sign({ userId }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  });
};

const normalizeUserName = (userName) =>
  String(userName ?? "")
    .trim()
    .toLowerCase(); // if username is 'null' or 'undefined' use ''

// 4. checking username availability, suggestions
const buildUsernameSuggestions = (userName) => {
  const normalized = normalizeUserName(userName).replace(/\s+/g, "");
  const compact = normalized.replace(/[^a-z0-9._-]/g, "");
  const base = compact || "user";

  const candidates = [
    `${base}1`,
    `${base}01`,
    `${base}_1`,
    `${base}.1`,
    `${base}2026`,
    `${base}_official`,
    `${base}_me`,
  ];

  // filter out the candidate suggestions and return
  return [...new Set(candidates)]
    .map((candidate) =>
      candidate
        .replace(/[^a-z0-9._-]/gi, "")
        .replace(/^[._-]+|[._-]+$/g, "")
        .slice(0, 30),
    )
    .filter((candidate) => USERNAME_FORMAT.test(candidate)); // .test returns 'true' or 'false', so invalid ones do not return
};

const getAvailableUsernameSuggestions = async (userName) => {
  const candidates = buildUsernameSuggestions(userName);

  if (candidates.length === 0) {
    return [];
  }

  // check whether usenam is already taken: if not return
  const checks = await Promise.all(
    candidates.map(async (candidate) => {
      const existingUser = await User.findOne({ userName: candidate });
      return existingUser ? null : candidate;
    }),
  );

  return checks.filter(Boolean).slice(0, 3);
  // filter(boolean): remove null values from updated arr
  // return max 3 name suggestions
};

// exports

// 1. register export
export const register = asyncHandler(async (req, res) => {
  const requestBody = req.body;

  // accountType is null checker
  if (!requestBody.accountType) {
    throw new AppError("accountType is required.", 400, "VALIDATION_ERROR");
  }

  const normalizedAccountType = normalizeAccountType(requestBody.accountType);

  // throw error if acc type is not listed in db
  if (!SUPPORTED_ACCOUNT_TYPES.includes(normalizedAccountType)) {
    throw new AppError(
      `Unsupported accountType. Supported types are: ${SUPPORTED_ACCOUNT_TYPES.join(", ")}.`,
      400,
      "VALIDATION_ERROR",
    );
  }

  // user and org profile creations: call constructors/profile.creator.js
  if (normalizedAccountType === "individual") {
    return await createUserProfile(req, res);
  }
  if (normalizedAccountType === "organization") {
    return await createOrganizationProfile(req, res);
  }
});

// 2. export username usability
export const checkUsernameAvailability = asyncHandler(async (req, res) => {
  const requestedUserName = req.query.userName;
  const normalizedUserName = normalizeUserName(requestedUserName);

  if (!normalizedUserName) {
    throw new AppError("userName is required.", 400, "VALIDATION_ERROR");
  }

  // check for username is in correct format
  const formatValid = USERNAME_FORMAT.test(normalizedUserName);
  // check for username availability
  const existingUser = await User.findOne({ userName: normalizedUserName });
  // username is available if format is correct and no other user used it before
  const available = Boolean(formatValid && !existingUser);
  // if not username available give suggestions list
  const suggestions = available
    ? []
    : await getAvailableUsernameSuggestions(normalizedUserName);

  return successResponse(res, 200, "Username availability checked.", {
    userName: normalizedUserName,
    available,
    formatValid,
    suggestions,
  });
});

// 3. export logins
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = String(email).toLowerCase().trim();

  // { user } object from the database
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  ); // default pw not retern by query, here specially asking for the password

  if (!user) {
    throw new AppError("Invalid credentials.", 401, "INVALID_CREDENTIALS");
  }

  if (!user.isActive) {
    throw new AppError(
      "This account has been deactivated or suspended.",
      403,
      "ACCOUNT_INACTIVE",
    );
  }

  const accountType = user.accountType;

  // checking the password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials.", 401, "INVALID_CREDENTIALS");
  }

  // sanitize the login type with backend and frontend mistmacthes
  const loginType = toLoginType(accountType);

  if (!loginType) {
    throw new AppError(
      "Invalid account type for user.",
      403,
      "INVALID_ACCOUNT_TYPE",
    );
  }

  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // not save in local storage, js cant access by getElement()
    secure: env.nodeEnv === "production", // cookie only send through HTTPS, not over HTTP
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    maxAge: ms(env.jwtRefreshExpiresIn), // calculated in milliseconds
  });

  return successResponse(res, 200, "Login successful.", {
    accessToken,
    loginType,
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      accountType: user.accountType,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
  });
});

// 4. export refresh token mechanism
export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new AppError("No refresh token provided.", 401, "NO_REFRESH_TOKEN");
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, env.jwtRefreshSecret);
  } catch (error) {
    throw new AppError(
      "Invalid or expired refresh token.",
      401,
      "INVALID_REFRESH_TOKEN",
    );
  }

  // find the user by decoding the user token
  const user = await User.findById(decoded.userId);

  if (!user || !user.isActive) {
    throw new AppError(
      "User not found or inactive.",
      401,
      "INVALID_REFRESH_TOKEN",
    );
  }

  const newAccessToken = createAccessToken(user._id);
  const loginType = toLoginType(user.accountType);

  return successResponse(res, 200, "Token refreshed.", {
    accessToken: newAccessToken,
    loginType,
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      accountType: user.accountType,
      createdAt: user.createdAt,
    },
  });
});

// 5. export logout
export const logout = asyncHandler(async (req, res) => {
  // Clear the refresh token cookie (must match the options used when setting it)
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
  });

  return successResponse(res, 200, "Logout successful.");
});
