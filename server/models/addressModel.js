import mongoose from "mongoose";

const { Schema } = mongoose;

const addressSchema = new Schema({
  name: { type: String, required: true, maxlength: 50 },
  houseName: { type: String, required: true,  }, 
  streetName: { type: String, required: true, },
  landmark: { type: String, required: true,  },  
  city: { type: String, required: true, maxlength: 50 },
  state: { type: String, required: true, maxlength: 50 },  
  pincode: {
    type: String,
    required: true,
    match: [/^\d{6}$/, "Invalid Pincode format. It must be exactly 6 digits."],
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Invalid Phone format. It must be exactly 10 digits."],  
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,  
  },
  createdAt: { type: Date, default: Date.now },
});

export const Address = mongoose.model("Address", addressSchema);

