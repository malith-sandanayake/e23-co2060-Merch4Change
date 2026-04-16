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
// Validates incoming donor data before creating a profile
router.post(
  "/signup/user",
  validateRequest({ body: validateUserProfileCreateBody }),
  createUserProfile
);

// Organization Signup
// Validates charity/NGO data before creating a profile
router.post(
  "/signup/organization",
  validateRequest({ body: validateOrganizationProfileCreateBody }),
  createOrganizationProfile
);

// The Login
// Public endpoint where users exchange credentials for a JWT
router.post("/login", login);

/**
 * @section PROTECTED ROUTES
 */

// Fetch Own Profile
// Uses 'protect' middleware to verify the JWT and 'getMe' to return user data
router.get("/me", protect, getMe);

export default router;