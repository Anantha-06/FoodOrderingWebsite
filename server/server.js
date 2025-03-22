import express from "express";
import { connectDb } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiRouter } from "./routes/version_1/index.js";

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
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

// Handle 404 errors
app.all("*", (req, res) => {
  res.status(404).json({ message: "End point does not exist" });
});
