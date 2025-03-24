import { cloudinaryInstance } from "../config/cloudinary.js";
import { Restaurant } from "../models/restaurantModel.js";
import bcrypt from "bcryptjs";
import { restaurantToken } from "../utilities/token.js";
import dotenv from "dotenv";

dotenv.config();

export const registerRestaurant = async (req, res) => {
  try {
    const { name, email, phone, password, contactEmail } = req.body;

    if (await Restaurant.findOne({ email })) {
      return res.status(400).json({ message: "Email already in use" });
    }
    if (await Restaurant.findOne({ phone })) {
      return res.status(400).json({ message: "Phone number already in use" });
    }

    if (!req.file) return res.status(400).json({ message: "No image uploaded" });
    if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Only JPG and PNG images allowed." });
    }

    const imageUri = await cloudinaryInstance.uploader.upload(req.file.path);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newRestaurant = new Restaurant({
      name,
      email,
      phone,
      password: hashedPassword,
      image: imageUri.url,
      contactEmail
    });

    await newRestaurant.save();
    const token = restaurantToken(newRestaurant);
    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(201).json({ message: "Restaurant registered successfully", newRestaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const restaurant = await Restaurant.findOne({ email });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (!restaurant.isVerified) {
      return res.status(403).json({ message: "Restaurant is not verified. Please wait for admin approval." });
    }

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = restaurantToken(restaurant);
    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.restaurant.id;
    const { name, email, phone, rating } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    if (name) restaurant.name = name;
    if (email) restaurant.email = email;
    if (phone) restaurant.phone = phone;
    if (rating) restaurant.rating = rating;

    if (req.file) {
      const imageUri = await cloudinaryInstance.uploader.upload(req.file.path);
      restaurant.image = imageUri.url;
    }

    await restaurant.save();
    res.status(200).json({ message: "Restaurant updated successfully", restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRestaurantProfile = async (req, res) => {
  try {
    const restaurantId = req.restaurant.id;
    const restaurant = await Restaurant.findById(restaurantId).select("-password");

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json({ message: "Restaurant profile fetched successfully", restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRestaurantByName = async (req, res) => {
  try {
    const { name } = req.params;
    const restaurant = await Restaurant.findOne({ name: { $regex: name, $options: "i" } }).select("-password");

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json({ message: "Restaurant found", restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllRestaurant = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ message: "All restaurants fetched", restaurants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurantId = req.restaurant.id;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) return res.status(404).json({ message: "No restaurant found" });

    res.status(200).json({ message: "Restaurant fetched successfully", restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.restaurant.id;
    const restaurant = await Restaurant.findByIdAndDelete(restaurantId);

    if (!restaurant) return res.status(404).json({ message: "No restaurant found" });

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
