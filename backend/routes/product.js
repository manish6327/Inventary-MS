import express from "express";

import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add Product
router.post("/add", authMiddleware, addProduct);

// Get Products
router.get("/", authMiddleware, getProducts);

// Update Product
router.put("/:id", authMiddleware, updateProduct);

// Delete Product
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
