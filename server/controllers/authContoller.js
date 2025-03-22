import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utilities/token.js";

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
    res.cookie("token", token, { httpOnly: false });
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
    res.cookie("token", token, { httpOnly: false });
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