import express from "express";
import {
  deleteRestaurant,
  getAllRestaurant,
  getRestaurantById,
  getRestaurantByName,
  getRestaurantProfile,
  loginRestaurant,
  logout,
  registerRestaurant,
  updateRestaurant,
} from "../../controllers/restaurantController.js";
import { upload } from "../../middileware/multermiddileware.js";
import { restaurantMiddleware } from "../../middileware/authmiddileware.js";

const router = express.Router();

router.post("/register", upload.single("image"), registerRestaurant);
router.post("/login", loginRestaurant);

router.put("/update", restaurantMiddleware, upload.single("image"), updateRestaurant);

router.get("/by/:name", getRestaurantByName);
router.get("/all", getAllRestaurant);
router.get("/id/:restaurantId", getRestaurantById);

router.delete("/delete/:restaurantId", deleteRestaurant);

router.post("/logout", restaurantMiddleware, logout);
router.get("/profile", restaurantMiddleware, getRestaurantProfile);
export const restaurantRouter = router;
