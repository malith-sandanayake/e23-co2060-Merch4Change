import { Router } from "express";
import rateLimit from "express-rate-limit";
import protect from "../middlewares/auth.js";
import { getMyDonations, getDonationStats, createDonation } from "../controllers/donationsController.js";
import AppError from "../utils/appError.js";

const router = Router();

const donationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP/user to 10 donation requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError("Donation limit reached. Try again later.", 429, "TOO_MANY_REQUESTS"));
  },
  keyGenerator: (req) => {
    // Rate limit per user if logged in, otherwise by IP
    return req.user ? req.user._id.toString() : req.ip;
  },
});

router.get("/my", protect, getMyDonations);
router.get("/my/stats", protect, getDonationStats);
router.post("/", protect, donationRateLimiter, createDonation);

export default router;
