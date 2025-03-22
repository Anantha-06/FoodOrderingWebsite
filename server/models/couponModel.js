import mongoose from "mongoose";

const { Schema } = mongoose;
const couponSchema = new Schema({
code:{type: String,required:true,unique: true},
discountPercentage:{type:Number,required:true},
minOrderVal:{type:Number,required:true},
MaxDiscValue:{type:Number,required:true},
expiryDate:{type:Date,required: true},
isAvailable:{
    type:Boolean,default:true
},
createdAt:{type:Date,default:Date.now}
}
)

export const Coupon = mongoose.model("Coupon", couponSchema);