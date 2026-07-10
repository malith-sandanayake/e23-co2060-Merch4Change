import Product from "../models/Product.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";


export const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // req.files comes from multer (array of files)
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) =>
          uploadBufferToCloudinary(file.buffer, "merch4change/products")
        )
      );
      images = uploads.map((upload) => upload.secure_url); // Extract secure_url
    }

    const product = await Product.create({
      name,
      price,
      description,
      images,
      ownerUserId: req.user._id,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserProducts = async (req, res) => {
  try {
    const { username } = req.params;
    const User = (await import("../models/User.js")).default;
    
    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const products = await Product.find({ ownerUserId: user._id })
      .populate("ownerUserId", "firstName lastName userName profileImageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
