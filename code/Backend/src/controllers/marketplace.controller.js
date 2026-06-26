import Brand from "../models/Brand.js";
import CoinTransaction from "../models/CoinTransaction.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

const resolveBrandForUser = async (user) => {
  const existing = await Brand.findOne({ ownerUserId: user._id });
  if (existing) {
    return existing;
  }

  const label = (user.userName && String(user.userName).trim()) || user.firstName || "Store";
  const brandName = label.length >= 2 ? label : `Store ${String(user._id).slice(-8)}`;

  return Brand.create({
    ownerUserId: user._id,
    brandName,
  });
};

const ensureProductOwnership = async (product, user) => {
  const brand = await Brand.findById(product.brandId);
  if (!brand || String(brand.ownerUserId) !== String(user._id)) {
    throw new AppError("You do not have permission to manage this product.", 403, "FORBIDDEN");
  }
};

export const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate("brandId", "brandName logoUrl slug");

  return successResponse(res, 200, "Products fetched successfully.", {
    products,
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId).populate("brandId", "brandName logoUrl slug");

  if (!product) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }

  return successResponse(res, 200, "Product fetched successfully.", {
    product,
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const brand = await resolveBrandForUser(req.user);
  const product = await Product.create({
    ...req.body,
    brandId: brand._id,
  });

  return successResponse(res, 201, "Product created successfully.", {
    product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }

  await ensureProductOwnership(product, req.user);

  Object.assign(product, req.body);
  const updatedProduct = await product.save();

  return successResponse(res, 200, "Product updated successfully.", {
    product: updatedProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }

  await ensureProductOwnership(product, req.user);

  await product.deleteOne();

  return successResponse(res, 200, "Product deleted successfully.", {
    productId: req.params.productId,
  });
});

export const checkout = asyncHandler(async (req, res) => {
  const requestedItems = req.body.items;
  const orderItems = [];
  let totalAmount = 0;

  for (const requestedItem of requestedItems) {
    const product = await Product.findById(requestedItem.productId);

    if (!product) {
      throw new AppError(`Product not found for id ${requestedItem.productId}.`, 404, "PRODUCT_NOT_FOUND");
    }

    if (product.stock < requestedItem.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}.`, 409, "INSUFFICIENT_STOCK");
    }

    const lineTotal = product.price * requestedItem.quantity;
    totalAmount += lineTotal;
    product.stock -= requestedItem.quantity;
    await product.save();

    orderItems.push({
      productId: product._id,
      titleSnapshot: product.name,
      quantity: requestedItem.quantity,
      unitPrice: product.price,
    });
  }

  const coinsEarned = Math.floor(totalAmount / 10);

  const order = await Order.create({
    userId: req.user._id,
    items: orderItems,
    currency: "USD",
    totalAmount,
    status: "paid",
    coinsEarned,
  });

  // UPDATED: Increment salesCount and update coinBalance
  await User.findByIdAndUpdate(req.user._id, { 
    $inc: { 
      salesCount: 1,
      coinBalance: coinsEarned 
    } 
  });

  if (coinsEarned > 0) {
    await CoinTransaction.create({
      userId: req.user._id,
      type: "earn",
      amount: coinsEarned,
      refType: "order",
      refId: order._id,
    });
  }

  // Create Notifications
  if (mongoose.Types.ObjectId.isValid(req.user._id)) {
    await Notification.create({
      userId: req.user._id,
      type: "order",
      message: `Your order for $${totalAmount.toFixed(2)} has been successfully placed! Order ID: #${order._id.toString().substring(18)}`,
      isRead: false,
    });
  }

  const buyerName = req.user.firstName && req.user.lastName
    ? `${req.user.firstName} ${req.user.lastName}`.trim()
    : (req.user.firstName || req.user.userName || "A customer");

  for (const requestedItem of requestedItems) {
    const product = await Product.findById(requestedItem.productId);
    if (product) {
      const brand = await Brand.findById(product.brandId);
      if (brand && brand.ownerUserId && mongoose.Types.ObjectId.isValid(brand.ownerUserId)) {
        await Notification.create({
          userId: brand.ownerUserId,
          type: "order",
          message: `You have received a new order for "${product.name}" (Qty: ${requestedItem.quantity}) from ${buyerName}!`,
          isRead: false,
        });
      }
    }
  }

  return successResponse(res, 201, "Checkout completed successfully.", {
    order,
    items: order.items,
  });
});

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });

  return successResponse(res, 200, "Orders fetched successfully.", {
    orders,
  });
});

export const getMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");
  }

  if (String(order.userId) !== String(req.user._id)) {
    throw new AppError("You do not have permission to view this order.", 403, "FORBIDDEN");
  }

  return successResponse(res, 200, "Order fetched successfully.", {
    order,
    items: order.items,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;

  if (!status) {
    throw new AppError("Status is required.", 400, "VALIDATION_ERROR");
  }

  const validStatuses = ["pending", "paid", "shipped", "completed", "cancelled", "refunded"];
  if (!validStatuses.includes(status)) {
    throw new AppError(`Invalid status. Allowed values: ${validStatuses.join(", ")}`, 400, "VALIDATION_ERROR");
  }

  const order = await Order.findById(orderId).populate("userId", "firstName lastName userName email");
  if (!order) {
    throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");
  }

  let isSeller = false;
  for (const item of order.items) {
    const product = await Product.findById(item.productId);
    if (product) {
      const brand = await Brand.findById(product.brandId);
      if (brand && String(brand.ownerUserId) === String(req.user._id)) {
        isSeller = true;
        break;
      }
    }
  }

  const isBuyer = String(order.userId._id || order.userId) === String(req.user._id);

  if (!isBuyer && !isSeller) {
    throw new AppError("You do not have permission to update this order.", 403, "FORBIDDEN");
  }

  const oldStatus = order.status;
  order.status = status;
  await order.save();

  if (status === "completed" && oldStatus !== "completed") {
    // Notify buyer
    const buyerId = order.userId._id || order.userId;
    if (mongoose.Types.ObjectId.isValid(buyerId)) {
      await Notification.create({
        userId: buyerId,
        type: "order",
        message: `Your order #${order._id.toString().substring(18)} has been marked as completed!`,
        isRead: false,
      });
    }

    // Notify seller(s)
    const buyerName = order.userId.firstName && order.userId.lastName
      ? `${order.userId.firstName} ${order.userId.lastName}`.trim()
      : (order.userId.firstName || order.userId.userName || "Customer");

    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const brand = await Brand.findById(product.brandId);
        if (brand && brand.ownerUserId && mongoose.Types.ObjectId.isValid(brand.ownerUserId)) {
          await Notification.create({
            userId: brand.ownerUserId,
            type: "order",
            message: `Order #${order._id.toString().substring(18)} for "${product.name}" with ${buyerName} has been successfully completed.`,
            isRead: false,
          });
        }
      }
    }
  }

  return successResponse(res, 200, "Order status updated successfully.", {
    order,
  });
});