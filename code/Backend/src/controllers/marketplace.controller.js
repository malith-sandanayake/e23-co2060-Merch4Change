import Product from "../models/Product.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

const ensureOrganizationSeller = (user) => {
  if (user?.accountType !== "organization") {
    throw new AppError("Only organization accounts can manage products.", 403, "FORBIDDEN");
  }
};

const ensureProductOwnership = (product, user) => {
  if (!product || String(product.brandId) !== String(user._id)) {
    throw new AppError("You do not have permission to manage this product.", 403, "FORBIDDEN");
  }
};

export const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  return successResponse(res, 200, "Products fetched successfully.", {
    products,
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }

  return successResponse(res, 200, "Product fetched successfully.", {
    product,
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  ensureOrganizationSeller(req.user);

  const product = await Product.create({
    ...req.body,
    brandId: req.user._id,
  });

  return successResponse(res, 201, "Product created successfully.", {
    product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  ensureOrganizationSeller(req.user);

  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }

  ensureProductOwnership(product, req.user);

  Object.assign(product, req.body);
  const updatedProduct = await product.save();

  return successResponse(res, 200, "Product updated successfully.", {
    product: updatedProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  ensureOrganizationSeller(req.user);

  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }

  ensureProductOwnership(product, req.user);

  await product.deleteOne();

  return successResponse(res, 200, "Product deleted successfully.", {
    productId: req.params.productId,
  });
});

export const checkout = asyncHandler(async (req, res) => {
  const requestedItems = req.body.items;
  const checkoutItems = [];
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

    checkoutItems.push({
      productId: product._id,
      quantity: requestedItem.quantity,
      price: product.price,
    });
  }

  const order = await Order.create({
    userId: req.user._id,
    totalAmount,
    status: "paid",
    coinsEarned: Math.floor(totalAmount / 10),
  });

  const orderItems = [];
  for (const item of checkoutItems) {
    orderItems.push(
      await OrderItem.create({
        orderId: order._id,
        ...item,
      }),
    );
  }

  return successResponse(res, 201, "Checkout completed successfully.", {
    order,
    items: orderItems,
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

  const items = await OrderItem.find({ orderId: order._id });

  return successResponse(res, 200, "Order fetched successfully.", {
    order,
    items,
  });
});