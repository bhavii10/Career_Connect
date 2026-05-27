
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "in-progress"],
      default: "pending",
    },
    resume: {
      data: Buffer,
      contentType: String,
      filename: String,
    },
    skills: {
      type: [String],
      default: [],
    },

    atsScore: {
      type: Number,
      default: 0,
    },

    experienceScore: {
      type: Number,
      default: 0,
    },

    projectScore: {
      type: Number,
      default: 0,
    },

    aiScore: {
      type: Number,
      default: 0,
    },

    recommendation: {
      type: String,
      default: "Moderate Fit",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);









