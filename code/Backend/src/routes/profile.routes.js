import { Router } from "express";

import { createUserProfile, createOrganizationProfile, getOrganizationProfile } from "../constructors/profile.creator.js";
import protect from "../middlewares/auth.js";
import validateRequest from "../middlewares/validateRequest.js";
import { validateOrganizationProfileCreateBody, validateUserProfileCreateBody } from "../validators/profile.validator.js";

const router = Router();

router.post(
  "/signup/user",
  //mapUserSignupBody,
  validateRequest({ body: validateUserProfileCreateBody }),
  createUserProfile,
);

router.post(
  "/signup/organization",
  validateRequest({ body: validateOrganizationProfileCreateBody }),
  createOrganizationProfile,
);

router.post("/login", protect, getOrganizationProfile);

//router.get("/login", protect, getOrganizationProfile);

export default router;
