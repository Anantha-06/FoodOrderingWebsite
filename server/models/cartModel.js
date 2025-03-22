import mongoose from "mongoose";

const { Schema } = mongoose;
const cartSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    restaurantId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Restaurant",
      required:true,
    },
    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        foodName: {
          type: String,
          required: true,
        },
        foodImage: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        totalItemPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    cartStatus:{
      type: String,
    }
  },

  { timestamps:true }
);

cartSchema.method.calulateTotalPrice = function(){
  this.totalPrice = this.items.reduce((total,items)=> total + items.price,0);
}

export const Cart = mongoose.model("Cart", cartSchema);