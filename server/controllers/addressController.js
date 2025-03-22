import { Address } from "../models/addressModel.js";
import { User } from "../models/userModel.js";
import { isValidObjectId } from "mongoose";

export async function createAddress(req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingAddress = await Address.findOne({ userId });
    if (existingAddress) {
      return res.status(400).json({ message: "Address already exists. Please update instead." });
    }

    const {
      name,
      houseName,
      streetName,
      landmark,
      city,
      state,
      pincode,
      phone
    } = req.body;

    if (!name || !houseName || !streetName || !landmark || !city || !state || !pincode || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAddress = new Address({
      name,
      houseName,
      streetName,
      landmark,
      city,
      state,
      pincode,
      phone,
      userId,
    });

    await newAddress.save();
    res.status(201).json({ message: "Address Added Successfully", address: newAddress });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteAddress(req, res) {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found or does not belong to the user" });
    }

    await Address.findByIdAndDelete(addressId);

    res.status(200).json({ message: "Address Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAddress(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const userId = req.user.id;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const address = await Address.findOne({ userId }).select(
      "name houseName streetName landmark city state pincode phone"
    );
    if (!address) {
      return res.status(404).json({ message: "No address found for this user" });
    }
    res.status(200).json({ message: "User Address Fetched Successfully", address });
  } catch (error) {
    console.error("Error fetching address for user:", req.user?.id, error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}


export async function updateAddress(req, res) {
  try {
    const userId = req.user.id;


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }


    let address = await Address.findOne({ userId });
    if (!address) {
      return res.status(404).json({ message: "Address Not Found" });
    }

    const updatedData = req.body;
    const requiredFields = [
      "name",
      "houseName",
      "streetName",
      "landmark",
      "city",
      "state",
      "pincode",
      "phone",
    ];

    for (const field of requiredFields) {
      if (!updatedData[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    address = await Address.findOneAndUpdate(
      { userId },
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Address Updated Successfully", address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
