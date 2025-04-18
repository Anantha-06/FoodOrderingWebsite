
import { Review } from "../models/reviewModel.js";
import { Order } from "../models/orderModel.js";
import { Restaurant } from "../models/restaurantModel.js";

export const addOrUpdateReview = async (req, res) => {
  try {
    const { restaurantId, orderId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      restaurant: restaurantId,
      status: "delivered"
    });

    if (!order) {
      return res.status(400).json({
        message: "You can only review restaurants you've ordered from and received delivery."
      });
    }

    let review = await Review.findOne({
      user: userId,
      restaurant: restaurantId
    });

    if (review) {

      review.rating = rating;
      review.comment = comment;
      review.order = orderId;
    } else {

      review = new Review({
        user: userId,
        restaurant: restaurantId,
        rating,
        comment,
        order: orderId
      });
    }

    await review.save();

    res.status(200).json({
      message: "Review submitted successfully",
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurantReviews = async (req, res) => {
    try {
      const { restaurantId } = req.params;
  
      const reviews = await Review.find({ restaurant: restaurantId })
        .populate("user", "name profilePicture")
        .sort({ createdAt: -1 });
  
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : 0;
  
      res.status(200).json({
        totalReviews,
        averageRating: Number(averageRating),
        reviews
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

export const getUserReview = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({
      user: userId,
      restaurant: restaurantId
    });

    res.status(200).json(review || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};