// handles the branching logic between regular users and charities (Organizations) for Merch4Change
import { Router } from "express";
import { 
  createUserProfile, 
  createOrganizationProfile, 
  login, 
  getMe 
} from "../controllers/profile.controller.js"; 

import protect from "../middlewares/auth.js";
import validateRequest from "../middlewares/validateRequest.js";
import { 
  validateOrganizationProfileCreateBody, 
  validateUserProfileCreateBody 
} from "../validators/profile.validator.js";

const router = Router();

/**
 * @section PUBLIC ROUTES
 */

// User Signup
router.post(
  "/signup/user",
  validateRequest({ body: validateUserProfileCreateBody }),
  createUserProfile
);

// Organization Signup
router.post(
  "/signup/organization",
  validateRequest({ body: validateOrganizationProfileCreateBody }),
  createOrganizationProfile
);

// The Login - NO 'protect' here. This is where they GET the token.
router.post("/login", login);

/**
 * @section PROTECTED ROUTES
 */

// Fetch own profile - 'protect' ensures only the logged-in user can see this.
router.get("/me", protect, getMe);

export default router;