import express from "express";
import { requireSignIn } from "../middlewares/auth.js";
import {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
  getMyReviews
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/addreview", requireSignIn, addReview);
router.get("/getreviews/:bookId", getReviews);
router.put("/updatereview/:id", requireSignIn, updateReview);
router.delete("/:id", requireSignIn, deleteReview);
router.get("/myreviews", requireSignIn, getMyReviews);
export default router;
