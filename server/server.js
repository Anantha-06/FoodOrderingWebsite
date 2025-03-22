import express from "express";
import { connectDb } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiRouter } from "./routes/version_1/index.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://byteeats.vercel.app",
  "https://byteeats-anantha-krishnan-ms-projects.vercel.app",
  "https://byteeats-git-main-anantha-krishnan-ms-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin:", origin); 
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors()); 

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