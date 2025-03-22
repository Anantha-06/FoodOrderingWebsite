import mongoose from "mongoose";

const { Schema } = mongoose;

const menuItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  category: { type: String }, 
});

const restaurantSchema = new Schema({
  name: { type: String, required: true, maxlength: 50 },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^[0-9]{10}$/ 
  },
  contactEmail: {
    type: String,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    required: false, 
    default: null, 
  },
  password: { type: String, required: true },
  image: { type: String },
  isVerified: { type: Boolean, default: false },
  isOpen: { type: Boolean, default: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  menu: [menuItemSchema], 
  createdAt: { type: Date, default: Date.now },
});

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
