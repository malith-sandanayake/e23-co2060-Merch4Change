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

// Register route
// POST /api/v1/auth/register -> validate request -> register controller
router.post(
  "/register",
  validateRequest({ body: validateRegisterBody }),
  register,
);

// Login route
// POST /api/v1/auth/login -> validate request -> login controller -> return JWT token
router.post(
  "/login", 
  validateRequest({ body: validateLoginBody }), 
  login
);

// Protected route (Get Current User)
// GET /api/v1/auth/me -> protect middleware (JWT check) -> me controller -> return user info
router.get("/me", protect, me);

export default router;