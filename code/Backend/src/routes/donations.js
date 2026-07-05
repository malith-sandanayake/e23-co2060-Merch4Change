import { Router } from "express";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import protect from "../middlewares/auth.js";
import {
  getMyDonations,
  getDonationStats,
  createDonation,
} from "../controllers/donationsController.js";
import AppError from "../utils/appError.js";

const router = Router();

const donationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 donation requests per hour
  standardHeaders: true,
  legacyHeaders: false,

  // Use the helper to correctly handle IPv4 and IPv6 addresses
  keyGenerator: (req) => ipKeyGenerator(req.ip),

  handler: (req, res, next) => {
    next(
      new AppError(
        "Donation limit reached. Try again later.",
        429,
        "TOO_MANY_REQUESTS"
      )
    );
  },
});

router.get("/my", protect, getMyDonations);
router.get("/my/stats", protect, getDonationStats);
router.post("/", protect, donationRateLimiter, createDonation);

export default router;