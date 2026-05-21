const Review = require("../models/Review");

// ==========================
// GET ALL REVIEWS
// ==========================
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({
      createdAt: -1,
    });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: err.message,
    });
  }
};

// ==========================
// CREATE REVIEW
// ==========================
exports.createReview = async (req, res) => {
  try {
    const { userId, name, rating, comment } =
      req.body;

    // One review per user
    const existingReview = await Review.findOne({
      userId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "User already submitted a review",
      });
    }

    const review = new Review({
      userId,
      name,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create review",
      error: err.message,
    });
  }
};

// ==========================
// UPDATE REVIEW
// ==========================
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedReview =
      await Review.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );

    if (!updatedReview) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update review",
      error: err.message,
    });
  }
};

// ==========================
// DELETE REVIEW
// ==========================
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview =
      await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete review",
      error: err.message,
    });
  }
};