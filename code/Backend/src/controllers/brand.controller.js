import Brand from "../models/Brand.js";

export const createBrand = async (req, res) => {
  try {
    const { brandName, description, logoUrl } = req.body;
    const brand = await Brand.create({
      ownerUserId: req.user._id,
      brandName,
      description,
      logoUrl,
    });
    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ logoUrl: { $ne: "" } })
      .select("brandName logoUrl")
      .limit(50);
    return res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};