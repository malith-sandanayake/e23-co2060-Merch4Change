import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 3,
      default: "USD",
    },
    images: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    isLimitedEdition: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;

