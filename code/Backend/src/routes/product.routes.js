import express from 'express';
import upload from '../middlewares/upload.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import Product from '../models/Product.js';

const router = express.Router();

router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    // 1. Upload each file to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        imageUrls.push(url);
      }
    }

    // 2. Save product with image URLs
    const product = await Product.create({
      ...req.body,
      images: imageUrls,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
