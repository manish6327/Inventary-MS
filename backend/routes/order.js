import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import { addOrder, getMyOrders, getAllOrders, updateOrderStatus} from "../controllers/orderCotroller.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Order route is working",
  });
});

// Customer places order
router.post("/add", authMiddleware, addOrder);

// Customer gets their own orders
router.get("/my-orders", authMiddleware, getMyOrders);

// Admin gets all orders
router.get("/all", authMiddleware, getAllOrders);

// Admin updates order status
router.put("/:id/status", authMiddleware, updateOrderStatus);

export default router;
