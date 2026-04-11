import { Router } from "express";

import { register } from "../controllers/auth.controller.js";
import { createOrganizationProfile, getOrganizationProfile } from "../controllers/profile.controller.js";
import protect from "../middlewares/auth.js";
import validateRequest from "../middlewares/validateRequest.js";
import { validateRegisterBody } from "../validators/auth.validator.js";
import { validateOrganizationProfileCreateBody } from "../validators/profile.validator.js";

const router = Router();

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const mapUserSignupBody = (req, res, next) => {
  const firstName = normalizeString(req.body?.firstName);
  const lastName = normalizeString(req.body?.lastName);
  const username = normalizeString(req.body?.username);

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || username;

  req.body = {
    fullName,
    email: req.body?.email,
    password: req.body?.password,
    confirmPassword: req.body?.confirmPassword,
    accountType: "individual",
  };

  next();
};

router.post(
  "/signup/user",
  mapUserSignupBody,
  validateRequest({ body: validateRegisterBody }),
  register,
);

router.post(
  "/signup/organization",
  validateRequest({ body: validateOrganizationProfileCreateBody }),
  createOrganizationProfile,
);

router.post("/login", protect, getOrganizationProfile);

//router.get("/login", protect, getOrganizationProfile);

export default router;
