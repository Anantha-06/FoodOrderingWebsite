import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No Token Provided" });
    }

    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = tokenDecoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

//role Middileware//

export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied" }); // Use `return` to stop execution
    }
    next();
  };
};

export const restaurantMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No Token Provided" });
    }

    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.restaurant = tokenDecoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};