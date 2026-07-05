// code/Backend/routes/admin.routes.js
import { Router } from "express";
import protect from "../middlewares/auth.js";
import requireRole from "../middlewares/requireRole.js";
import validateRequest from "../middlewares/validateRequest.js";
import { validateCharityRejectBody } from "../validators/charity.validator.js";
import {
  listCharitiesForReview, getCharityForReview,
  approveCharity, rejectCharity,
} from "../controllers/adminCharity.controller.js";

const router = Router();

router.use(protect, requireRole("admin"));

router.get("/charities", listCharitiesForReview);
router.get("/charities/:id", getCharityForReview);
router.patch("/charities/:id/approve", approveCharity);
router.patch("/charities/:id/reject", validateRequest({ body: validateCharityRejectBody }), rejectCharity);

export default router;
