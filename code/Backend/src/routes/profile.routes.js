import { Router } from "express";

import { createOrganizationProfile, getOrganizationProfile } from "../controllers/profile.controller.js";
import protect from "../middlewares/auth.js";
import validateRequest from "../middlewares/validateRequest.js";
import { validateOrganizationProfileCreateBody } from "../validators/profile.validator.js";

const router = Router();

router.post(
  "/organization",
  validateRequest({ body: validateOrganizationProfileCreateBody }),
  createOrganizationProfile,
);

router.get("/organization", protect, getOrganizationProfile);

export default router;
