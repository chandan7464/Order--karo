import express from "express";
import {
  createOrder,
  getMyOrders,
  getShopOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// Customer routes
router.post("/create", isAuth, createOrder);
router.get("/my-orders", isAuth, getMyOrders);
router.delete("/:orderId/cancel", isAuth, cancelOrder);

// Shop owner routes
router.get("/shop/:shopId", isAuth, getShopOrders);
router.patch("/:orderId/status", isAuth, updateOrderStatus);

// Shared
router.get("/:orderId", isAuth, getSingleOrder);

export default router;