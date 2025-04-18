import express from "express";
import {
    authMiddleware,
  } from "../../middileware/authmiddileware.js";
import { addOrUpdateReview, getRestaurantReviews, getUserReview } from "../../controllers/reviewController.js";

const router = express.Router();

router.post("/:restaurantId/orders/:orderId/create", authMiddleware, addOrUpdateReview);
router.get("/:restaurantId/all", getRestaurantReviews);
router.get("/:restaurantId/my-review", authMiddleware, getUserReview);

export const reviewRoutes = router;