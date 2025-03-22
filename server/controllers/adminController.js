import { Restaurant } from "../models/restaurantModel.js";


export const verifyRestaurant = async (req, res) => {
    try {
      const { restaurantId } = req.params;
  
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      restaurant.isVerified = true;
      await restaurant.save();
  
      res.status(200).json({ message: "Restaurant verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  