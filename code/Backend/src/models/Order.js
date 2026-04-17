import mongoose from "mongoose";

const orderItemEmbeddedSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    titleSnapshot: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemEmbeddedSchema],
      default: [],
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 3,
      default: "USD",
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      default: "pending",
      enum: ["pending", "paid", "shipped", "completed", "cancelled", "refunded"],
    },
    coinsEarned: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;

