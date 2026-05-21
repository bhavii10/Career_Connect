const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

// POST /api/scores - Save score
router.post("/", async (req, res) => {
  try {
    const { userId, name, email, category, score, total } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "name and email are required" });
    }

    const newScore = new Score({
      userId,
      name,
      email,
      category,
      score,
      total,
    });

    const savedScore = await newScore.save();
    console.log("Saved Score:", savedScore);
    res.json(savedScore);
  } catch (err) {
    console.error("Error saving score:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/scores - Fetch all scores
router.get("/", async (req, res) => {
  try {
    const scores = await Score.find().sort({ date: -1 });
    console.log("Fetched Scores:", scores);
    res.json(scores);
  } catch (err) {
    console.error("Error fetching scores:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
