// Jobs.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Jobs.css";
import { Briefcase, MapPin, UserPlus } from "lucide-react";
import { createPortal } from "react-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [applicant, setApplicant] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
  });

  const [applyStatus, setApplyStatus] = useState("");

  const fetchJobs = async (search = "") => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs", {
        params: search ? { search } : {},
      });

      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Prevent background scrolling when modal opens
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchTerm.trim());
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", applicant.name);
    formData.append("email", applicant.email);
    formData.append("phone", applicant.phone);
    formData.append("jobId", selectedJob._id);
    formData.append("resume", applicant.resume);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/applications",
        formData
      );

      setApplyStatus(res.data.message);

      setShowModal(false);

      // reset form
      setApplicant({
        name: "",
        email: "",
        phone: "",
        resume: null,
      });

    } catch (err) {
      console.error(err);
      setApplyStatus("Failed to apply.");
    }
  };

  return (
    <div className="jobs-container">

      <h1>💼 Available Jobs</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search by title, company, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      {/* Job Listings */}
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job._id} className="job-card">

            <h2>
              <Briefcase className="icon" />
              {job.title}
            </h2>

            <p>
              <UserPlus className="icon-small" />
              {job.company}
            </p>

            <p>
              <MapPin className="icon-small" />
              {job.location}
            </p>

            <button
              onClick={() => {
                setSelectedJob(job);
                setShowModal(true);
              }}
            >
              Apply Now
              <UserPlus className="icon-small" />
            </button>

          </div>
        ))
      ) : (
        <p>No jobs posted yet.</p>
      )}

      {/* Modal */}
      {showModal &&
  createPortal(
    <div
      className="modal-overlay"
      onClick={() => setShowModal(false)}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Apply for {selectedJob.title}</h2>

        <form
          onSubmit={handleApplySubmit}
          encType="multipart/form-data"
        >
          <input
            type="text"
            placeholder="Name"
            required
            value={applicant.name}
            onChange={(e) =>
              setApplicant({
                ...applicant,
                name: e.target.value,
              })
            }
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={applicant.email}
            onChange={(e) =>
              setApplicant({
                ...applicant,
                email: e.target.value,
              })
            }
          />

          <input
            type="tel"
            placeholder="Phone"
            required
            value={applicant.phone}
            onChange={(e) =>
              setApplicant({
                ...applicant,
                phone: e.target.value,
              })
            }
          />

          <input
            type="file"
            required
            onChange={(e) =>
              setApplicant({
                ...applicant,
                resume: e.target.files[0],
              })
            }
          />

          <button type="submit">
            Submit Application
          </button>

          <button
            type="button"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>,
    document.body
  )}

      {applyStatus && (
        <p className="status-message">
          {applyStatus}
        </p>
      )}

    </div>
  );
}