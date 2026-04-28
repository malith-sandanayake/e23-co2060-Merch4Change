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
      images = uploads; // [{url, public_id}, ...]
    }

    const product = await Product.create({
      name,
      price,
      description,
      images,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
