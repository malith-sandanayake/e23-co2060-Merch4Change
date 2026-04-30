import { Router } from "express";

import { checkUsernameAvailability, login, register } from "../controllers/auth.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import { validateLoginBody, validateRegisterBody } from "../validators/auth.validator.js";

const router = Router();



router.post("/register", validateRequest({ body: validateRegisterBody }), register);
router.get("/username-availability", checkUsernameAvailability);
router.post("/login", validateRequest({ body: validateLoginBody }), login);


export default router;
