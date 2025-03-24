import express from "express";
import {
  createPayment,
  getPayments,
  verifyPayment,
} from "../../controllers/paymentController.js";
import { authMiddleware, roleMiddleware } from "../../middileware/authmiddileware.js";
const router = express.Router();

router.post("/create/:orderId", authMiddleware, createPayment);
router.post("/verify", authMiddleware, verifyPayment);
router.get("/transaction", authMiddleware,roleMiddleware("admin"), getPayments);
export const paymentRouter = router;
