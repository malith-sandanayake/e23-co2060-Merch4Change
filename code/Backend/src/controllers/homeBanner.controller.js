// src/controllers/homeBanner.controller.js
import HomeBanner from "../models/HomeBanner.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer);

    const banner = await HomeBanner.create({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json(banner);
  } catch (err) {
    console.error("uploadBanner error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getBanners = async (_req, res) => {
  try {
    const banners = await HomeBanner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await HomeBanner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
