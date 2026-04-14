import { Router } from "express";

import protect from "../middlewares/auth.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createProduct,
  checkout,
  deleteProduct,
  getMyOrder,
  getProduct,
  listMyOrders,
  listProducts,
  updateProduct,
} from "../controllers/marketplace.controller.js";
import {
  validateCheckoutBody,
  validateProductCreateBody,
  validateProductUpdateBody,
} from "../validators/marketplace.validator.js";

const router = Router();

router.get("/products", listProducts);
router.get("/products/:productId", getProduct);
router.post("/products", protect, validateRequest({ body: validateProductCreateBody }), createProduct);
router.patch(
  "/products/:productId",
  protect,
  validateRequest({ body: validateProductUpdateBody }),
  updateProduct,
);
router.delete("/products/:productId", protect, deleteProduct);
router.post("/checkout", protect, validateRequest({ body: validateCheckoutBody }), checkout);
router.get("/orders", protect, listMyOrders);
router.get("/orders/:orderId", protect, getMyOrder);

export default router;