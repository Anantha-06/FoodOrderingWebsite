import express from "express";
import {
  getProfile,
  getRole,
  profileUpdate,
  signUp,
} from "../../controllers/authContoller.js";
import { authMiddleware, roleMiddleware } from "../../middileware/authmiddileware.js";
import { adminlogin, verifyRestaurant } from "../../controllers/adminController.js";

const router = express.Router();

router.post("/login",adminlogin);
router.post("/signup", signUp);
router.get("/profile", authMiddleware, getProfile);
router.put("/update", authMiddleware, profileUpdate);
router.get("/profile/role", authMiddleware, getRole);
router.put("/verify/:restaurantId",authMiddleware,roleMiddleware("admin"),verifyRestaurant)

export const adminRouter = router;
