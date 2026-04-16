// endpoint to confirm backend is running and healthy
import { Router } from "express";
import mongoose from "mongoose"; // To check DB status
import { successResponse } from "../utils/apiResponse.js";
import AppError from "../utils/appError.js";

const router = Router();

// when someone send GET /health this function runs 
router.get("/health", (req, res, next) => {
  try {
    // 1. Check MongoDB Connection (0 = disconnected, 1 = connected)
    const dbStatus = mongoose.connection.readyState === 1 ? "up" : "down";

    if (dbStatus === "down") {
      // If DB is down, throw an error so the Error Handler catches it
      throw new AppError("Database connection is down", 503, "SERVICE_UNAVAILABLE");
    }

    return successResponse(res, 200, "Health check successful.", {
      service: "merch4change-backend",
      status: "ok",
      db: dbStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // This is where the exception is caught!
    next(error); 
  }
});


export default router;