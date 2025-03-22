import express from "express";
import { connectDb } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiRouter } from "./routes/version_1/index.js";
import dotenv from "dotenv";

dotenv.config(); 
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");
app.use(
  cors({
    origin: "https://byteeatsfoods.vercel.app", // Ensure this matches exactly
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true, // If using cookies or auth
  })
);

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://byteeatsfoods.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRouter);

const db = connectDb;
db();

app.listen(port, () =>
  console.log(`Server running on port: http://localhost:${port}`)
);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Endpoint does not exist" });
});
