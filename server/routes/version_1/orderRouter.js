import express from "express";
import { createOrder, getAllOrders, getAllRestaurantOrders, getOrderById, updateOrderStatus, updateOrderUser } from "../../controllers/orderController.js";
import { authMiddleware } from "../../middileware/authmiddileware.js";
const router = express.Router();

router.post("/update",authMiddleware,createOrder)
router.get("/get/all",authMiddleware,getAllOrders)
router.get("/by/:orderId",authMiddleware,getOrderById)
router.put("/update/:orderId",authMiddleware,updateOrderUser)
router.put("/update/status/:orderId",authMiddleware,updateOrderStatus)
router.get("/restaurant-order/:restaurantId",getAllRestaurantOrders)

export const orderRouter = router;
