import { Coupon } from "../models/couponModel.js";
import { Order } from "../models/orderModel.js";

const ORDER_STATUS = [
  "pending",
  "confirmed",
  "preparing",
  "out for delivery",
  "delivered",
  "cancelled",
];

export const createOrder = async (req, res) => {
  try {
    const user = req.user.id;
    const { restaurant, cartId, coupon, deliveryAddress } = req.body;
    const findCoupon = coupon ? await Coupon.findOne({ code: coupon }) : null;

    const order = new Order({
      user,
      restaurant,
      cartId,
      coupon: findCoupon?._id || null,
      deliveryAddress,
    });
    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const user = req.user.id;
    const orders = await Order.find({ user })
      .sort({ createdAt: -1 })
      .populate([
        { path: "user", select: "name email phone" },
        { path: "restaurant", select: "name location" },
        {
          path: "cartId",
          select: "items totalPrice",
          populate: { path: "items.foodId", select: "name" },
        },
        { path: "coupon", select: "code discountPercentage maxDiscountValue" },
        { path: "deliveryAddress", select: "street city state zipCode" },
      ]);
    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this profile" });
    }
    res.status(200).json({ message: "Orders found successfully", orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const user = req.user.id;
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, user }).populate([
      { path: "user", select: "name email phone" },
      { path: "restaurant", select: "name location" },
      {
        path: "cartId",
        select: "items totalPrice",
        populate: { path: "items.foodId", select: "name" },
      },
      { path: "coupon", select: "code discountPercentage maxDiscountValue" },
      { path: "deliveryAddress", select: "street city state zipCode" },
    ]);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json({ message: "Order retrieved successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderUser = async (req, res) => {
  try {
    const user = req.user.id;
    const { orderId } = req.params;
    const { coupon, status, deliveryAddress } = req.body;

    const order = await Order.findOne({ _id: orderId, user });

    if (!order) {
      return res.status(404).json({ message: "No order found for this user." });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Order is already cancelled and cannot be modified.",
      });
    }
    if (coupon) {
      const findCoupon = await Coupon.findOne({ code: coupon });
      if (!findCoupon) {
        return res.status(400).json({ message: "Invalid coupon code." });
      }
      order.coupon = findCoupon._id;
    }
    if (deliveryAddress) {
      order.deliveryAddress = deliveryAddress;
    }
    if (status) {
      if (status === "cancelled") {
        order.status = "cancelled";
      } else {
        return res
          .status(400)
          .json({ message: "Users are only allowed to cancel orders." });
      }
    }

    await order.save();
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const currentIndex = ORDER_STATUS.indexOf(order.status);
    if (currentIndex === -1 || currentIndex === ORDER_STATUS.length - 1) {
      return res
        .status(400)
        .json({ message: "Order is already in the final state." });
    }

    order.status = ORDER_STATUS[currentIndex + 1];
    await order.save();
    res
      .status(200)
      .json({ message: `Order status updated to '${order.status}'`, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const orders = await Order.find({
      restaurant: restaurantId,
      status: { $ne: "cancelled" },
    }).populate([
      { path: "user", select: "name email phone" },
      { path: "restaurant", select: "name location" },
      {
        path: "cartId",
        select: "items totalPrice",
        populate: { path: "items.foodId", select: "name" },
      },
      { path: "coupon", select: "code discountPercentage maxDiscountValue" },
      { path: "deliveryAddress", select: "street city state zipCode" },
    ]);

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this restaurant" });
    }
    res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
