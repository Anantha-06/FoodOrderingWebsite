import express from "express";
import { connectDb } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiRouter } from "./routes/version_1/index.js";
import dotenv from "dotenv";

dotenv.config(); 
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URI, 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], 
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

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
