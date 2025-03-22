import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

export const generateToken = (user, role) => {
  try {
    var token = jwt.sign(
      { id: user._id,role:user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7h",
      }
    );
    return token;
  } catch (error) {
    console.error("error generating token",error.message);
    return null
  }
};

export const restaurantToken = (restaurant) => {
  try {
    var token = jwt.sign(
      { id: restaurant._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7h",
      }
    );
    return token;
  } catch (error) {
    console.error("error generating token",error.message);
    return null
  }
};
