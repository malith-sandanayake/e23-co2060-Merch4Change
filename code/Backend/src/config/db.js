import mongoose from "mongoose";
import env from "./env.js";
import { logError, logInfo } from "../utils/logger.js";

export const connectDatabase = async () => {
  if (!env.mongodbUri) {
    logInfo("MONGODB_URI is not set. Server will start without a database connection.");
    return;
  }

  try {
    await mongoose.connect(env.mongodbUri);
    logInfo("Database connected successfully.");
  } catch (error) {
    logError("Database connection failed.", error);
    throw error;
  }
};
