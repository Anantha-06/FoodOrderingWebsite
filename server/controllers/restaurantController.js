import { cloudinaryInstance } from "../config/cloudinary.js";
import { Restaurant } from "../models/restaurantModel.js";
import bcrypt from "bcryptjs";
import { restaurantToken } from "../utilities/token.js";

export const registerRestaurant = async (req, res) => {
  try {
    const { name, email, phone, password, image, contactEmail } = req.body;
    const existingRestaurantEmail = await Restaurant.findOne({ email });
    if (existingRestaurantEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const existingRestaurantPhone = await Restaurant.findOne({ phone });
    if (existingRestaurantPhone) {
      return res.status(400).json({ message: "Phone number already in use" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
    const allowedImageTypes = ['image/jpeg', 'image/png'];
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Invalid image type. Only JPG and PNG are allowed." });
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

    // Save the new restaurant to the database
    await newRestaurant.save();

    // Create token
    const token = restaurantToken(newRestaurant);

    // Set the token in a cookie
    res.cookie("token", token, { httpOnly: false });

    // Respond with success
    res.status(201).json({ message: "Restaurant registered successfully", newRestaurant });

  } catch (error) {
    console.log(error); // Log the error for debugging purposes
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
    res.cookie("token", token, { httpOnly: false });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export async function updateRestaurant(req, res) {
  try {
    const restaurantId  = req.restaurant.id
    console.log(restaurantId)
    const { name, email, phone,rating } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (name) restaurant.name = name;
    if (email) restaurant.email = email;
    if (phone) restaurant.phone = phone;
    if (rating) restaurant.rating = rating;
    if (req.file) {
      const imageUri = await cloudinaryInstance.uploader.upload(req.file.path);
      restaurant.image = imageUri.url;
    }
    const updateRestaurant = await restaurant.save();
    return res
      .status(200)
      .json({ message: "Restaurant updated Successfully", updateRestaurant });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getRestaurantByName(req,res) {
  try {
    const {name} = req.params
    const restaurant = await Restaurant.findOne({name:{$regex:name,$options:"i" }}).select("-password")
    if(restaurant.length=== 0)  {
return res.status(404).json({message:"Restaurant Not Found"})
    }
    res.status(200).json({message:"Restaurant Found", restaurant})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllRestaurant(req,res) {
  try {
    const restaurant = await Restaurant.find()
    res.status(200).json({message:"All Restaurant Are Fetched", restaurant})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getRestaurantById(req,res) {
  try {
    const {restaurantId} = req.params
    const findRestaurant = await Restaurant.findById(restaurantId)
    if(!findRestaurant){
return res.status(404).json({message:"No Restaurant found"})
    }
    res.status(200).json({message: "Restaurant Fetched Successfully",findRestaurant})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });  
  }
}

export async function deleteRestaurant(req,res) {
  try {
    const {restaurantId} = req.params
const findRestaurant = await Restaurant.findById(restaurantId)
    if(!findRestaurant){
return res.status(404).json({message:"No Restaurant found"})
    }
const restaurantDel = await Restaurant.findByIdAndDelete(restaurantId)
res.status(200).json({message:"Restaurat Have Been Deleted Successfully"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });  
  }
}

export async function logout(req,res) {
  try {
    res.clearCookie("token")
    res.status(200).json({message:"Logged Out Succesfully"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}