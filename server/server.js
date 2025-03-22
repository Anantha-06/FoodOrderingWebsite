import express from "express";
import { connectDb } from "./config/db.js"; // Database connection
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://byteeats.vercel.app", // Production
  "https://byteeats-anantha-krishnan-ms-projects.vercel.app", // Vercel preview
  "https://byteeats-git-main-anantha-krishnan-ms-projects.vercel.app", // Vercel preview
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS")); // Block the request
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Handle preflight requests
app.options("*", cors());

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api", (req, res, next) => {
  console.log("API route hit:", req.url);
  next();
});

// Example route
app.get("/api/menu/all", (req, res) => {
  res.json({ message: "Menu data", items: ["Pizza", "Burger", "Pasta"] });
});

// 404 handler
app.all("*", (req, res) => {
  res.status(404).json({ message: "Endpoint does not exist" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// Connect to the database
connectDb()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});