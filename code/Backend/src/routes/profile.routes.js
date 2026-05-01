import { Router } from "express";

import { me, getMyCoins } from "../controllers/profile.controller.js";
import protect from "../middlewares/auth.js";

const router = Router();

router.get("/me", protect, me);
router.get("/me/coins", protect, getMyCoins);

export default router;
