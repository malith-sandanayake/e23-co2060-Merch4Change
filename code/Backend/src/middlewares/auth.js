import jwt from "jsonwebtoken";

import env from "../config/env.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    const error = new Error("Not authorized. Token is missing.");
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      const error = new Error("User not found for token.");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (verifyError) {
    const error = new Error("Not authorized. Invalid token.");
    error.statusCode = 401;
    throw error;
  }
});

export default protect;
