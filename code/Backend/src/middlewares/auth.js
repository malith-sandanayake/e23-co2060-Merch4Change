import jwt from "jsonwebtoken";

import env from "../config/env.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  // get the authorization header from the request, if not exist empty strings
  const authHeader = req.headers.authorization || "";

  // extract the token
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    throw new AppError(
      "Not authorized. Token is missing.",
      401,
      "TOKEN_MISSING",
    );
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select("-password");
    // look up user in database using ID from token, remove password field

    // token is valid, but user was deleted
    if (!user) {
      throw new AppError("User not found for token.", 401, "USER_NOT_FOUND");
    }

    // attach user to the request
    req.user = user;
    // move to the next middleware or route
    next();
  } catch (verifyError) {
    // catch errors happen in try
    // invalid token, expired token, user not found
    throw new AppError("Not authorized. Invalid token.", 401, "INVALID_TOKEN");
  }
});

export default protect;
