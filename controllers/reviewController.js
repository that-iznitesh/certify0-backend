import reviewModel from "../models/reviewModel.js";

export const addReview = async (req, res) => {
  try {
    const { bookId, rating, reviewText } = req.body;
       const userId = req.user._id;

    // Check if user already reviewed this book
    const existingReview = await reviewModel.findOne({ bookId, userId });
    
    if (existingReview) {
      return res.status(400).json({ 
        message: "You have already reviewed this book. Please edit your existing review.",
        reviewId: existingReview._id 
      });
    }

    const review = new reviewModel({
      bookId,
      userId: req.user._id,
      rating,
      reviewText,
    });
    await review.save();
    res.status(201).json({
        message: "Review added successfully",
        review});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await reviewModel.find({ bookId }).populate('userId', 'name');
    const avgRating = reviews.length
      ? (reviews.map(r => r.rating).reduce((a, b) => a + b) / reviews.length).toFixed(2)
      : null;
    res.json({ reviews, avgRating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await reviewModel.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not allowed" });
    Object.assign(review, req.body);
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await reviewModel.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not allowed" });
    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyReviews = async (req, res) => {

  try {
    const userId = req.user._id;
    
    // Find all reviews by current user and populate both book and user info
    const reviews = await reviewModel.find({ userId })
      .populate('bookId', 'title author')
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

