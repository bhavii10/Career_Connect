
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  jobType: { 
    type: String, 
    enum: ["Full-Time", "Part-Time", "Internship", "Contract"], 
    default: "Full-Time" 
  },
  description: { type: String, required: true },
  skills: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);



