import axios from "axios";
import { API_BASE_URL } from "../config";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const getReviews = () => API.get("/reviews");

export const createReview = (reviewData) =>
  API.post("/reviews", reviewData);

export const updateReview = (id, reviewData) =>
  API.put(`/reviews/${id}`, reviewData);

export const deleteReview = (id) =>
  API.delete(`/reviews/${id}`);