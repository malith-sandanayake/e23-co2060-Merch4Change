// src/routes/homeBanner.routes.js
import express from "express";
import multer from "multer";
import {
  uploadBanner,
  getBanners,
  deleteBanner,
} from "../controllers/homeBanner.controller.js";

const router = express.Router();

// Multer in-memory storage (file stays in RAM, then sent to Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

router.get("/", getBanners);
router.post("/", upload.single("image"), uploadBanner);
router.delete("/:id", deleteBanner);

export default router;
