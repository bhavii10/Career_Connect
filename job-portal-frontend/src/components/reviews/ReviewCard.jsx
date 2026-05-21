import React from "react";

export default function ReviewCard({
  review,
  currentUser,
  onEdit,
  onDelete,
}) {
  return (
    <div className="review-card">
      <h4>{review.name}</h4>

      <p>{"⭐".repeat(review.rating)}</p>

      <p>"{review.comment}"</p>

      {currentUser?._id === review.userId && (
        <div className="review-actions">
          <button onClick={() => onEdit(review)}>Edit</button>

          <button onClick={() => onDelete(review._id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}