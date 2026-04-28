import { Router } from "express";
import { createBrand } from "../controllers/brand.controller.js";
import protect from "../middlewares/auth.js";


const router = Router();

router.post("/", protect, createBrand);

export default router;
