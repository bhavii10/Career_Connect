const express = require("express");

const router = express.Router();

const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// ==========================
// ROUTES
// ==========================

// GET ALL REVIEWS
router.get("/", getReviews);

// CREATE REVIEW
router.post("/", createReview);

// UPDATE REVIEW
router.put("/:id", updateReview);

// DELETE REVIEW
router.delete("/:id", deleteReview);

module.exports = router;