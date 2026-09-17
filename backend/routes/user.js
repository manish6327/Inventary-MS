import express from "express";

import {
  addUser,
  getUsers,
  deleteUser,
  getProfile,
  updateProfile
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add User
router.post("/add", authMiddleware, addUser);

// Get All Users
router.get("/", authMiddleware, getUsers);

// Delete User
router.delete("/:id", authMiddleware, deleteUser);

// Get logged-in user's profile
router.get("/profile", authMiddleware, getProfile);

// Update logged-in user's profile
router.put("/profile", authMiddleware, updateProfile);


export default router;
