import express from "express";
import { upload } from "../middlewares/upload.js";
import protect from "../middlewares/auth.js";
import { createProduct, getUserProducts } from "../controllers/product.controller.js";

const router = express.Router();

// "images" must match the field name your frontend sends
// max 5 images per product
router.post("/", protect, upload.array("images", 5), createProduct);

router.get("/user/:username", getUserProducts);

export default router;
