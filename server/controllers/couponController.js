import { Coupon } from "../models/couponModel.js";
import { User } from "../models/userModel.js";

export async function createCoupon(req, res) {
    try {
  
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const { code, discountPercentage, minOrderVal, maxDiscValue, expiryDate, isAvailable } = req.body;
        if (!code || typeof code !== "string") {
            return res.status(400).json({ message: "Coupon code is required and must be a string" });
        }
        if (!discountPercentage || !minOrderVal || !maxDiscValue || !expiryDate) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const couponExist = await Coupon.findOne({ code: req.body.code });
if (couponExist) {
    return res.status(400).json({ message: "Coupon code already exists" });
}

    
        let formattedExpiryDate;
        if (typeof expiryDate === "string") {
            const [day, month, year] = expiryDate.split("/");
            formattedExpiryDate = new Date(`${year}-${month}-${day}`);
        } else {
            formattedExpiryDate = new Date(expiryDate);
        }

        if (isNaN(formattedExpiryDate.getTime())) {
            return res.status(400).json({ message: "Invalid expiry date format" });
        }

        const newCoupon = new Coupon({
            code,
            discountPercentage,
            minOrderVal,
            maxDiscValue,
            expiryDate: formattedExpiryDate,
            isAvailable: isAvailable !== undefined ? isAvailable : true,
        });

        await newCoupon.save();
        res.status(201).json({ message: "New Coupon added successfully", newCoupon });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get all available coupons
export async function getAllCoupons(req, res) {
    try {
        const coupons = await Coupon.find({ isAvailable: true });
        if (coupons.length === 0) {
            return res.status(404).json({ message: "No available coupons found" });
        }
        res.status(200).json({ message: "Coupons retrieved successfully", data: coupons });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}
