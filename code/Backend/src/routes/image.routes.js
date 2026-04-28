import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router();

// Multer setup: store file in memory as Buffer (max 2MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Helper: validate MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ============================================================
   PRODUCT IMAGE ROUTES
   ============================================================ */

// Upload product image  (POST /api/v1/images/product/:id)
router.post("/product/:id", upload.single("image"), async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.image = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
    await product.save();

    res.status(200).json({ message: "Product image uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// View product image  (GET /api/v1/images/product/:id)
router.get("/product/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(req.params.id);
    if (!product || !product.image || !product.image.data) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.set("Content-Type", product.image.contentType);
    res.send(product.image.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   USER PROFILE IMAGE ROUTES
   ============================================================ */

// Upload user profile image  (POST /api/v1/images/user/:id)
router.post("/user/:id", upload.single("image"), async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profileImage = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
    await user.save();

    res.status(200).json({ message: "Profile image uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// View user profile image  (GET /api/v1/images/user/:id)
router.get("/user/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(req.params.id);
    if (!user || !user.profileImage || !user.profileImage.data) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.set("Content-Type", user.profileImage.contentType);
    res.send(user.profileImage.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
