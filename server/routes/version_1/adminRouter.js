import express from "express";
import {
  getProfile,
  getRole,
  login,
  profileUpdate,
  signUp,
} from "../../controllers/authContoller.js";
import { authMiddleware } from "../../middileware/authmiddileware.js";
import { verifyRestaurant } from "../../controllers/adminController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signUp);
router.get("/profile", authMiddleware, getProfile);
router.put("/update", authMiddleware, profileUpdate);
router.get("/profile/role", authMiddleware, getRole);
router.put("/verify/:restaurantId",verifyRestaurant)

export const adminRouter = router;
