import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utilities/token.js";
import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose";

export async function signUp(req, res) {
  try {
    const { name, email, phone, password, profilePic, role } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All Fields Required" });
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      profilePic,
      role,
    });
    await newUser.save();
    const token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV === "production", 
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none":"strict", 
    });
    res.status(201).json({ message: "Signed Up Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({ message: "Fill All Required Fields" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Wrong Password" });
    }
    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV === "production", 
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none":"strict", 
    })
    res.status(200).json({ message: "Logged in Successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function profileUpdate(req, res) {
  try {
    const { name, email, phone, profilePic } = req.body;
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, profilePic },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "profile updated Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unable To Find User" });
    }
    res.status(200).json({ message: "User Profile Fetched Sucessfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getRole(req, res) {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    const user = await User.findById(userId).select("role");
    if (!user) {
      return res.status(404).json({ message: "Unable To Find User" });
    }
    res.status(200).json({ message: "Role Fetched Sucessfully", user });
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

export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ message: "All Users Fetched Successfully", users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({ message: "User Deleted Successfully", deletedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updatePasswordWithVerification(req, res) {
  try {
    const { email, phone, newPassword } = req.body;
    if (!email || !phone || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
    if (user.phone !== phone) {
      return res.status(400).json({ message: "Phone number does not match" });
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}