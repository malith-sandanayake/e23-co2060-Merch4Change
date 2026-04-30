import { Router } from "express";
import { createBrand, getAllBrands } from "../controllers/brand.controller.js";
import protect from "../middlewares/auth.js";

const router = Router();

router.get("/", getAllBrands);          // PUBLIC — anyone can view
router.post("/", protect, createBrand); // existing — login required

export default router;
