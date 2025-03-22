import express from "express";
import { createCoupon } from "../../controllers/couponController.js";
import {
    authMiddleware,
    roleMiddleware,
  } from "../../middileware/authmiddileware.js";

const router = express.Router();

router.post("/create",authMiddleware,roleMiddleware("admin"),createCoupon)

export const couponRouter = router;
