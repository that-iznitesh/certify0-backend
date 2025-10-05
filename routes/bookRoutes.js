import express from "express";
import { requireSignIn } from "../middlewares/auth.js";
import {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
} from "../controllers/bookController.js";

const router = express.Router();

router.get("/getbook", getBooks);
router.get("/getbookbyid/:id", getBookById);
router.post("/addbook", requireSignIn, addBook);
router.put("/updatebook/:id", requireSignIn, updateBook);
router.delete("/deletebook/:id", requireSignIn, deleteBook);
router.get("/search", searchBooks);
export default router;
