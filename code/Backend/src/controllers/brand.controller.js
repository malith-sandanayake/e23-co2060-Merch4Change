import Brand from "../models/Brand.js";

export const createBrand = async (req, res) => {
  try {
    const { brandName, description, logoUrl } = req.body;

    const brand = await Brand.create({
      ownerUserId: req.user._id,   // taken from logged-in user
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
