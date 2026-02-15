import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectMongo } from "./lib/db.js";
import authRoutes from "./Routes/auth.route.js";
import reviewRoutes from "./Routes/review.route.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

// Connect to MongoDB
connectMongo();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/v1", authRoutes);
app.use("/api/review", reviewRoutes);

// middleware to handle errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port " + process.env.PORT || 5000);
});
