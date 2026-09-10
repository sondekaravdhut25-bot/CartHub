const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, getOrderById);
router.post("/:id/verify-payment", protect, verifyPayment);
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
