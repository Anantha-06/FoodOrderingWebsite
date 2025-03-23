import express from "express";
import { createCoupon, getAllCoupons } from "../../controllers/couponController.js";
import {
    authMiddleware,
    roleMiddleware,
  } from "../../middileware/authmiddileware.js";

const router = express.Router();

router.post("/create",authMiddleware,roleMiddleware("admin"),createCoupon)
router.get("/avaiable",authMiddleware,getAllCoupons)

export const couponRouter = router;
