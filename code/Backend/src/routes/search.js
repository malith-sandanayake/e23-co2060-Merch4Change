import { Router } from "express";
import protect from "../middlewares/auth.js";
import createRateLimiter from "../middlewares/rateLimit.js";
import { searchAll } from "../controllers/searchController.js";

const router = Router();

const searchLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many search requests. Please slow down.",
  code: "TOO_MANY_REQUESTS",
});

router.get("/", protect, searchLimiter, searchAll);

export default router;
