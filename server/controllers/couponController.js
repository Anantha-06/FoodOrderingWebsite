import { Coupon } from "../models/couponModel.js";
import { User } from "../models/userModel.js";

export async function createCoupon(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const { code, discountPercentage, minOrderVal, MaxDiscValue, expiryDate, isAvailable } = req.body;
        if (!code || !discountPercentage || !minOrderVal || !MaxDiscValue || !expiryDate) {
            return res.status(401).json({ message: "All Fields Are Required" });
        }

        const couponExist = await Coupon.findOne({ code: code });
        if (couponExist) {
            return res.status(400).json({ message: "Code Already Exists" });
        }
        const [day, month, year] = expiryDate.split('/');
        const formattedExpiryDate = new Date(`${year}-${month}-${day}`);

        if (isNaN(formattedExpiryDate.getTime())) {
            return res.status(400).json({ message: "Invalid Expiry Date Format" });
        }

        const newCoupon = new Coupon({
            code,
            discountPercentage,
            minOrderVal,
            MaxDiscValue,
            expiryDate: formattedExpiryDate, 
            isAvailable,
        });

        await newCoupon.save();
        res.status(201).json({ message: "New Coupon is Added Successfully", newCoupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
