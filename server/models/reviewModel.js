import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Restaurant", 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    maxlength: 500 
  },
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Order" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date 
  }
}, {
  timestamps: false // We handle updatedAt manually
});

// Ensure a user can only leave one review per restaurant
reviewSchema.index({ user: 1, restaurant: 1 }, { unique: true });

// Update timestamp when review is modified
reviewSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

/**
 * Calculates and updates the average rating for a restaurant
 * @param {mongoose.Types.ObjectId} restaurantId 
 */
reviewSchema.statics.calculateAverageRating = async function(restaurantId) {
  const result = await this.aggregate([
    {
      $match: { restaurant: restaurantId }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  try {
    await mongoose.model("Restaurant").findByIdAndUpdate(
      restaurantId,
      {
        rating: result[0]?.averageRating.toFixed(1) || 0, // Round to 1 decimal
        reviewCount: result[0]?.reviewCount || 0
      },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating restaurant rating:", error);
  }
};

// Update restaurant rating after save
reviewSchema.post('save', async function(doc) {
  await doc.constructor.calculateAverageRating(doc.restaurant);
});

// Update restaurant rating after remove
reviewSchema.post('remove', async function(doc) {
  await doc.constructor.calculateAverageRating(doc.restaurant);
});

export const Review = mongoose.model("Review", reviewSchema);