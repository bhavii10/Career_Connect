import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  FaFileAlt,
  FaChalkboardTeacher,
  FaBriefcase,
} from "react-icons/fa";

import ReviewForm from "../../components/reviews/ReviewForm";
import ReviewCard from "../../components/reviews/ReviewCard";

import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../../api/reviewApi";

import "./UserPage.css";

export default function UserPage({ user, setUser, role }) {
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  // =========================
  // AVERAGE RATING
  // =========================
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (acc, review) => acc + Number(review.rating),
            0
          ) / reviews.length
        ).toFixed(1)
      : 0;

  // =========================
  // FETCH REVIEWS
  // =========================
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await getReviews();
      setReviews(res.data);
    } catch (err) {
      console.log("Error fetching reviews:", err);
    }
  };

  // =========================
  // ADD REVIEW
  // =========================
  const handleAddReview = async (reviewData) => {
    try {
      // One review per user
      const alreadyReviewed = reviews.find(
        (review) => review.userId === user._id
      );

      if (alreadyReviewed) {
        alert("You already added a review.");
        return;
      }

      const newReview = {
        ...reviewData,
        rating: Number(reviewData.rating),
        userId: user._id,
        name: user.name,
      };

      const res = await createReview(newReview);

      setReviews([res.data, ...reviews]);
    } catch (err) {
      console.log("Error adding review:", err);
    }
  };

  // =========================
  // UPDATE REVIEW
  // =========================
  const handleUpdateReview = async (id, updatedData) => {
    try {
      const res = await updateReview(id, {
        ...updatedData,
        rating: Number(updatedData.rating),
      });

      setReviews(
        reviews.map((review) =>
          review._id === id ? res.data : review
        )
      );

      setEditingReview(null);
    } catch (err) {
      console.log("Error updating review:", err);
    }
  };

  // =========================
  // DELETE REVIEW
  // =========================
  const handleDeleteReview = async (id) => {
    try {
      await deleteReview(id);

      setReviews(
        reviews.filter((review) => review._id !== id)
      );
    } catch (err) {
      console.log("Error deleting review:", err);
    }
  };

  return (
    <div className="page-container">
      {/* Floating Background Circles */}
      <div className="floating-bg">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>

      {/* Navbar */}
      <Navbar user={user} setUser={setUser} role={role} />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="main-title">
              <span>Welcome, Job Seeker!</span>
              <span className="highlight">Boost Your Career</span>
            </h1>

            <p className="subtitle">
              Explore tools to build your resume, prepare for
              interviews, and apply to top companies seamlessly.
            </p>

            <button
              className="enter-btn user"
              onClick={() => navigate("/jobs")}
            >
              Find Jobs
            </button>
          </div>

          <div className="hero-image">
            <img
              src="/images/choice-worker-concept.png"
              alt="Career Illustration"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features">
          <div
            className="card"
            onClick={() => navigate("/resume-builder")}
          >
            <FaFileAlt size={40} className="icon-gradient" />
            <h3>Resume Builder</h3>
          </div>

          <div
            className="card"
            onClick={() => navigate("/interview-prep")}
          >
            <FaChalkboardTeacher
              size={40}
              className="icon-gradient"
            />
            <h3>Interview Prep</h3>
          </div>

          <div
            className="card"
            onClick={() => navigate("/jobs")}
          >
            <FaBriefcase size={40} className="icon-gradient" />
            <h3>Jobs</h3>
          </div>

          <div
            className="card"
            onClick={() => navigate("/notifications")}
          >
            <span
              className="icon-gradient"
              style={{ fontSize: "2rem" }}
            >
              🔔
            </span>

            <h3>Notifications</h3>
          </div>
        </div>

        <div className="features-info">
          <h2>Why Choose Us?</h2>

          <p>
            Trusted by thousands of job seekers and top
            companies, our platform provides AI-powered tools
            for resume building, personalized interview prep,
            and instant notifications.
          </p>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="reviews-section">
        <h2>User Reviews</h2>

        {/* Average Rating Summary */}
        <div className="rating-summary">
          <div className="rating-stars">
            ⭐ {averageRating} / 5
          </div>

          <p>
            Based on {reviews.length}{" "}
            {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Review Form */}
        <ReviewForm
          addReview={handleAddReview}
          editingReview={editingReview}
          updateReviewHandler={handleUpdateReview}
        />

        {/* Reviews */}
        <div className="reviews-cards">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                currentUser={user}
                onEdit={setEditingReview}
                onDelete={handleDeleteReview}
              />
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </section>

      {/* Companies Section */}
      <section className="companies-section">
        <h2>Trusted by Top Companies</h2>

        <div className="marquee">
          <div className="marquee-track">
            <img src="/images/microsoft.png" alt="Microsoft" />
            <img src="/images/amazon.png" alt="Amazon" />
            <img src="/images/Accenture.png" alt="Accenture" />
            <img src="/images/tcs.png" alt="TCS" />
            <img src="/images/infosys.png" alt="Infosys" />
            <img src="/images/google.png" alt="Google" />

            {/* Duplicate */}
            <img src="/images/microsoft.png" alt="Microsoft" />
            <img src="/images/amazon.png" alt="Amazon" />
            <img src="/images/Accenture.png" alt="Accenture" />
            <img src="/images/tcs.png" alt="TCS" />
            <img src="/images/infosys.png" alt="Infosys" />
            <img src="/images/google.png" alt="Google" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}