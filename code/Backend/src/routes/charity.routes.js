// code/Backend/routes/charity.routes.js
import { Router } from "express";
import protect from "../middlewares/auth.js";
import validateRequest from "../middlewares/validateRequest.js";
import { charityDocumentUpload } from "../middlewares/charityDocumentUpload.js";
import { validateCharityVerificationBody } from "../validators/charity.validator.js";
import {
  submitVerification,
  getMyCharity,
  listVerifiedCharities,
  uploadProofDocument,
} from "../controllers/charity.controller.js";

const router = Router();

router.get("/", listVerifiedCharities);
router.get("/me", protect, getMyCharity);
router.post(
  "/documents",
  protect,
  charityDocumentUpload.single("file"),
  uploadProofDocument,
);
router.post(
  "/verify",
  protect,
  validateRequest({ body: validateCharityVerificationBody }),
  submitVerification,
);

export default router;
