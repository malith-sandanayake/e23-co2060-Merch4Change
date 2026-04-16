// connect routes, middleware, controllers to handle authentication requests

import { Router } from "express";

import { login, me, register } from "../controllers/auth.controller.js";
import protect from "../middlewares/auth.js"; // JWT check
import validateRequest from "../middlewares/validateRequest.js"; // input validator
import {
  validateLoginBody,
  validateRegisterBody,
} from "../validators/auth.validator.js";

// create the router
const router = Router();

// register route
router.post(
  "/register",
  validateRequest({ body: validateRegisterBody }),
  register,
);
// POST /register > valid request(checks body) > register control > response

// login route
router.post("/login", validateRequest({ body: validateLoginBody }), login);
// POST /login > validate request > login controller > return JWT token

// protected route
router.get("/me", protect, me);
// GET /me > protect middleware (JWT check) > me controller > return logged-in user

export default router;
