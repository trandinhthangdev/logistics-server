const express = require("express");
const OrderController = require("./../controllers/order.controller");
const { asyncWrapper } = require("../utils/asyncWrapper");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Get all orders
router.get("/", authMiddleware(), asyncWrapper(OrderController.getAllOrders));

// Create a new order
router.post("/", authMiddleware(), asyncWrapper(OrderController.createOrder));

// Add other routes for updating and deleting orders

module.exports = router;
