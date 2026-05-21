
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);









