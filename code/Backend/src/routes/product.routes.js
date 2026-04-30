import express from "express";
import { upload } from "../middlewares/upload.js";
import { createProduct } from "../controllers/product.controller.js";

const router = express.Router();

// "images" must match the field name your frontend sends
// max 5 images per product
router.post("/", upload.array("images", 5), createProduct);

export default router;
