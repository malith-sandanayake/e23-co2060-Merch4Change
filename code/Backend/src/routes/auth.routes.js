import { Router } from "express";

import { login, me, register } from "../controllers/auth.controller.js";
import protect from "../middlewares/auth.js";
import validateRequest from "../middlewares/validateRequest.js";
import { validateLoginBody, validateRegisterBody } from "../validators/auth.validator.js";

const router = Router();



router.post("/register", validateRequest({ body: validateRegisterBody }), register);
router.post("/login", validateRequest({ body: validateLoginBody }), login);
router.get("/me", protect, me);

export default router;
