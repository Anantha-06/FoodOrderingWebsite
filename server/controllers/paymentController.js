import Payment from "../models/paymentModel.js";
import RazorPay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import { Cart } from "../models/cartModel.js";
import { Order } from "../models/orderModel.js";

dotenv.config();
const razorpay = new RazorPay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export const createPayment = async (req, res) => {
  try {
    const user = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status !== "pending") {
      if (order.status === "cancelled") {
        return res
          .status(400)
          .json({ message: "Cannot make payment for a cancelled order" });
      }
      if (order.status === "delivered") {
        return res
          .status(400)
          .json({ message: "You have already received your order" });
      }
      return res.status(400).json({
        message:
          "You have already made the payment for this order. Your order is on the way.",
      });
    }
    const amount = order.finalPrice;
    const amountInPaisa = amount * 100;
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaisa,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        orderId: orderId.toString(), 
        userId: user.toString(),
      },
    });

    const newPayment = new Payment({
      orderId,
      user,
      amount,
      status: "pending",
      transactionId: razorpayOrder.id,
    });

    const savedPayment = await newPayment.save();
    res.status(201).json({
      message: "Payment initiated successfully",
      payment: savedPayment,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Error in createPayment:", error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(sign)
      .digest("hex");
    if (generated_signature === razorpay_signature) {
      const payment = await Payment.findOneAndUpdate(
        { transactionId: razorpay_order_id },
        { status: "success" },
        { new: true }
      );

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      const order = await Order.findOneAndUpdate(
        { _id: payment.orderId },
        { status: "confirmed" },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const cart = await Cart.findOneAndUpdate(
        { _id: order.cartId },
        { cartStatus: "ordered" },
        { new: true }
      );

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      return res.status(200).json({ message: "Payment is successful" });
    } else {
      return res
        .status(400)
        .json({ message: "Payment verification failed at backend" });
    }
  } catch (error) {
    console.error("Error during payment verification:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("user").select("-password");
    return res
      .status(200)
      .json({ message: "Payments fetched successfully", data: payments });
  } catch (error) {
    console.error("Error during payment fetching:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
