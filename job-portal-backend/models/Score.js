const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  userId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Score", scoreSchema);
