import { Router } from "express";
import protect from "../middlewares/auth.js";
import { createDonation, listCharities } from "../controllers/donation.controller.js";

const router = Router();

router.get("/charities", listCharities);
router.post("/", protect, createDonation);

export default router;