import express from "express";
import { verifyToken } from "../lib/verifyToken.js";
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} from "../Controllers/review.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createReview);
router.get("/getReviews", getReviews);
router.delete("/delete/:r_id", verifyToken, deleteReview);
router.put("/update/:r_id", verifyToken, updateReview);

export default router;
