import React, { useState, useEffect } from "react";

export default function ReviewForm({
  addReview,
  editingReview,
  updateReviewHandler,
}) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (editingReview) {
      setComment(editingReview.comment);
      setRating(editingReview.rating);
    }
  }, [editingReview]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviewData = {
      comment,
      rating,
    };

    if (editingReview) {
      updateReviewHandler(editingReview._id, reviewData);
    } else {
      addReview(reviewData);
    }

    setComment("");
    setRating(5);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>{editingReview ? "Edit Review" : "Add Your Review"}</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        <option value={5}>5 Stars</option>
        <option value={4}>4 Stars</option>
        <option value={3}>3 Stars</option>
        <option value={2}>2 Stars</option>
        <option value={1}>1 Star</option>
      </select>

      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button type="submit">
        {editingReview ? "Update Review" : "Submit Review"}
      </button>
    </form>
  );
}