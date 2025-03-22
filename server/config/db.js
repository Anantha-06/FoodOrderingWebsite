import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const Mongourl = process.env.MONGO_URI

export const connectDb = async()=>{
    try {
        const response = await mongoose.connect(Mongourl)
        console.log("db connected successfully")
    } catch (error) {
        console.log("db error")
    }
}

