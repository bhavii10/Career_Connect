import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getReviews = () => API.get("/reviews");

export const createReview = (reviewData) =>
  API.post("/reviews", reviewData);

export const updateReview = (id, reviewData) =>
  API.put(`/reviews/${id}`, reviewData);

export const deleteReview = (id) =>
  API.delete(`/reviews/${id}`);