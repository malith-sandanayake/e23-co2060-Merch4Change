import mongoose from "mongoose";

/**
 * Legacy line-item collection. New checkouts store items on {@link Order} instead.
 */
const orderItemSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

export default OrderItem;

