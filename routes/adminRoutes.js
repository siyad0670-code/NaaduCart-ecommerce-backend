import express from "express";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

import { getDashboardStats } from "../controllers/adminController.js";

import {
getAllOrders,
getAdminOrderById,
updateOrderStatus,
} from "../controllers/adminOrderController.js";

import {
getAllUsers,
getUserById,
updateUserRole,
deleteUser,
} from "../controllers/adminUserController.js";

const router = express.Router();

router.use(protect, isAdmin);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Orders
router.get("/orders", getAllOrders);
router.get("/orders/:id", getAdminOrderById);
router.put("/orders/:id/status", updateOrderStatus);

// Users
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;