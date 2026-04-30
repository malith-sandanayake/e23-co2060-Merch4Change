import { Router } from "express";
import { successResponse } from "../utils/apiResponse.js";

const router = Router();

router.get("/health", (req, res) => {
  return successResponse(res, 200, "Health check successful.", {
    service: "merch4change-backend",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default router;
