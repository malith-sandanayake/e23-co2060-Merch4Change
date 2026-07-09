import { Router } from "express";

import { checkUsernameAvailability, login, register, refresh, logout } from "../controllers/auth.controller.js";
import { verifyRegisterOtp, resendRegisterOtp } from "../controllers/otp.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import { validateLoginBody, validateRegisterBody } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validateRequest({ body: validateRegisterBody }), register);
router.get("/username-availability", checkUsernameAvailability);
router.post("/verify-otp", verifyRegisterOtp);
router.post("/resend-otp", resendRegisterOtp);
router.post("/login", validateRequest({ body: validateLoginBody }), login);
router.post("/refresh", refresh);
router.post("/logout", logout);


export default router;
