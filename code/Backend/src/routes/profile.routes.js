import { Router } from "express";

import { me } from "../controllers/profile.controller.js";
import protect from "../middlewares/auth.js";

const router = Router();

router.get("/me", protect, me);

export default router;
