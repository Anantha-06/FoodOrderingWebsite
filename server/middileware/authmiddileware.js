import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Restaurant } from "../models/restaurantModel.js";

dotenv.config();

//  User Authentication Middleware
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

//  Role-Based Access Control Middleware
export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
    }
    next();
  };
};

//  Restaurant Authentication Middleware
export const restaurantMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No Token Provided" });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const restaurant = await Restaurant.findById(decoded.id);
    if (!restaurant) {
      return res.status(401).json({ message: "Unauthorized: Restaurant Not Found" });
    }

    req.restaurant = restaurant;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

