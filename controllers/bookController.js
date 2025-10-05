import bookModel from "../models/bookModel.js";

// Add new book (protected)
export const addBook = async (req, res) => {
  try {
    const { title, author, description, genre, year } = req.body;
    const book = new bookModel({
      title,
      author,
      description,
      genre,
      year,
      addedBy: req.user._id,
    });
    await book.save();
    res.status(201).json({
        sucess: true,
        book});
  } catch (error) {
    res.status(500).json({
        sucess: false,
        error: error.message });
  }
};

// Get paginated books (public)
export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const books = await bookModel.find()
      .populate('addedBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await bookModel.countDocuments();
    res.json({ books, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single book (with user info)
export const getBookById = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id).populate('addedBy', 'name email');
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update book (only creator)
export const updateBook = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.addedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not allowed" });
    Object.assign(book, req.body);
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete book (only creator)
export const deleteBook = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.addedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not allowed" });
    await book.deleteOne();
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
      ],
    });
    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};