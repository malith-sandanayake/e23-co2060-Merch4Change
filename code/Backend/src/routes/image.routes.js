import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import User from "../models/User.js";
import protect from "../middlewares/auth.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

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
router.post("/user/:id", protect, upload.single("image"), async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
    // ensure the authenticated user is updating their own profile
    if (req.user._id.toString() !== req.params.id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Upload to Cloudinary and save the secure URL
    try {
      const result = await uploadBufferToCloudinary(req.file.buffer, "merch4change/profiles");
      if (result && result.secure_url) {
        user.profileImageUrl = result.secure_url;
      }
    } catch (err) {
      // fallback: still save binary if cloud upload fails
      console.error("Cloudinary upload failed:", err.message || err);
    }

    // Keep binary copy for backward compatibility
    user.profileImage = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
    await user.save();

    res.status(200).json({ message: "Profile image uploaded successfully", profileImageUrl: user.profileImageUrl });
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

// Upload user cover image  (POST /api/v1/images/user/:id/cover)
router.post("/user/:id/cover", protect, upload.single("image"), async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    if (req.user._id.toString() !== req.params.id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const result = await uploadBufferToCloudinary(req.file.buffer, "merch4change/covers");
    if (result?.secure_url) {
      user.coverImageUrl = result.secure_url;
    }

    await user.save();

    res.status(200).json({
      message: "Cover image uploaded successfully",
      coverImageUrl: user.coverImageUrl,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
