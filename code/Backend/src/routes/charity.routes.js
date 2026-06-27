// code/Backend/routes/charity.routes.js
import { Router } from "express";
import protect from "../middlewares/auth.js";
import {
  submitVerification, getMyCharity, listVerifiedCharities,
} from "../controllers/charity.controller.js";

const router = Router();

router.get("/", listVerifiedCharities);          // public
router.get("/me", protect, getMyCharity);
router.post("/verify", protect, submitVerification);

export default router;
