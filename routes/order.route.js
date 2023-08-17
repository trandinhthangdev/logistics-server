const express = require("express");
const OrderController = require("./../controllers/order.controller");
const { asyncWrapper } = require("../utils/asyncWrapper");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Get all orders
router.get("/", authMiddleware(), asyncWrapper(OrderController.getAllOrders));

// Create a new order
router.post("/", authMiddleware(), asyncWrapper(OrderController.createOrder));

// Update info a order 
router.put(
    "/:orderNumber",
    authMiddleware(),
    asyncWrapper(OrderController.updateOrder)
);

// Delete a order 
router.delete(
    "/:orderNumber",
    authMiddleware(),
    asyncWrapper(OrderController.deleteOrder)
);


// Add other routes for updating and deleting orders
router.get(
    "/:orderNumber",
    // authMiddleware(),
    asyncWrapper(OrderController.getOrder)
);
router.post(
    "/change-status/:orderNumber",
    authMiddleware(),
    asyncWrapper(OrderController.changeOrderStatus)
);

router.post(
    "/review/:orderNumber",
    authMiddleware(),
    asyncWrapper(OrderController.reviewOrder)
);

module.exports = router;
