import mongoose from "mongoose";
import { Coupon } from "../models/couponModel.js";
import { Cart } from "../models/cartModel.js"
const { Schema } = mongoose;

const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  OUT_FOR_DELIVERY: "out for delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const orderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    totalAmount: { type: Number },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
    finalPrice: { type: Number, min: 0 },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    createdAt:{type:Date,default:Date.now}
  },
);

const applyDiscount = async (totalAmount, couponId) => {
  if (!couponId) return totalAmount;

  const coupon = await Coupon.findById(couponId);
  if (!coupon) throw new Error("Coupon not found.");
  if (!coupon.isAvailable) throw new Error("Coupon is inactive.");
  if (coupon.expiryDate < new Date()) throw new Error("Coupon has expired.");
  if (totalAmount < coupon.minOrderVal) {
    throw new Error(
      `Order value must be at least ${coupon.minOrderVal} to use this coupon.`
    );
  }

  const discount = Math.min(
    (totalAmount * coupon.discountPercentage) / 100,
    coupon.MaxDiscValue
  );

  return Math.max(totalAmount - discount, 0);
};

orderSchema.pre("save", async function (next) {
  try {
    const cart = await Cart.findById(this.cartId);
    if (!cart) {
      throw new Error("Cart not found. Unable to calculate total amount.");
    }
    this.totalAmount = cart.totalPrice;
    if (this.coupon) {
      this.finalPrice = await applyDiscount(this.totalAmount, this.coupon);
    } else {
      this.finalPrice = this.totalAmount;
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const Order = mongoose.model("Order", orderSchema);

