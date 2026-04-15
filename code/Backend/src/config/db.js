import mongoose from "mongoose";
import env from "./env.js";
import { logError, logInfo } from "../utils/logger.js";

// check the status of the Event Listner 
let isConnectionListenersBound = false;

const bindConnectionListeners = () => {
  if (isConnectionListenersBound) return;

  // if MongoDb connected well
  mongoose.connection.on("connected", () => {
    logInfo("MongoDB connection established.");
  });

  // MongoDB disconnected - connection drops 
  mongoose.connection.on("disconnected", () => {
    logInfo("MongoDB connection closed.");
  });

  // if something going wrong while the server is already running
  mongoose.connection.on("error", (error) => {
    logError("MongoDB runtime connection error.", error);
  });

  isConnectionListenersBound = true;
};

export const connectDatabase = async () => {
  if (!env.mongodbUri) {
    throw new Error("MongoDB URI is missing. Set MONGODB_URI (or MONGO_URI) in backend .env.");
  } // check for the MONGODB URI in the env file

  // 1 = connected, 2 = connecting
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    logInfo("MongoDB is already connected or connecting.");
    return;
  }

  try {
    mongoose.set("bufferCommands", false); // if database is still connecting dont keep buffer to run later
    mongoose.set("strictQuery", true); // ensuere search query can be done only for the fileds defined in database schema
    bindConnectionListeners();

    await mongoose.connect(env.mongodbUri, {
      maxPoolSize: 10, // max 10 parallel tunnels to the database
      minPoolSize: 1,  // if no one use the web site rn, keep one tunnel alive
      serverSelectionTimeoutMS: 10000, // if server cant find out MongoDb cluster in 10 sec jst give up
      socketTimeoutMS: 45000,  // max time for a one operation in database - 45 seconds 
    });

    logInfo("Database connected successfully."); // succeed
  } catch (error) {
    logError("Database connection failed.", error);
    throw error;
  }
};
