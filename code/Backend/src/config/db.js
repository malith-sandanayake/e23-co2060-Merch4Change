import mongoose from "mongoose";
import env from "./env.js";
import { logError, logInfo } from "../utils/logger.js";

let isConnectionListenersBound = false;

const bindConnectionListeners = () => {
  if (isConnectionListenersBound) return;

  mongoose.connection.on("connected", () => {
    logInfo("MongoDB connection established.");
  });

  mongoose.connection.on("disconnected", () => {
    logInfo("MongoDB connection closed.");
  });

  mongoose.connection.on("error", (error) => {
    logError("MongoDB runtime connection error.", error);
  });

  isConnectionListenersBound = true;
};

export const connectDatabase = async () => {
  if (!env.mongodbUri) {
    logInfo("MONGODB_URI is not set. Skipping MongoDB connection.");
    return;
  }

  // 1 = connected, 2 = connecting
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    logInfo("MongoDB is already connected or connecting.");
    return;
  }

  try {
    mongoose.set("bufferCommands", false);
    mongoose.set("strictQuery", true);
    bindConnectionListeners();

    await mongoose.connect(env.mongodbUri, {
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    logInfo("Database connected successfully.");
  } catch (error) {
    logError("Database connection failed.", error);
    throw error;
  }
};
