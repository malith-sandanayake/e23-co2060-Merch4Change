import Brand from "../models/Brand.js";
import CoinTransaction from "../models/CoinTransaction.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
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