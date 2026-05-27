import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  FaBriefcase,
  FaUsers,
  FaChartBar,
} from "react-icons/fa";


import "./EmployerPage.css";

export default function RecruiterPage({ user, setUser }) {
  const navigate = useNavigate();

  // =========================
  // STATES
  // ========================
 

  return (
    <div className="page-container">
      {/* Floating Background */}
      <div className="floating-bg">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>

      {/* Navbar */}
      <Navbar
        user={user}
        setUser={setUser}
        role="employer"
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="main-title">
              <span>Welcome, Recruiter!</span>

              <span className="highlight">
                Hire Top Talent
              </span>
            </h1>

            <p className="sub">
              Post jobs, manage applicants, and
              streamline your recruitment process
              efficiently.
            </p>

            <button
              className="enter-btn recruiter"
              onClick={() => navigate("/post-job")}
            >
              Post a Job
            </button>
          </div>

          <div className="hero-image">
            <img
              src="/images/recruiter.jpg"
              alt="Recruiter Illustration"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="features-section"
      >
        <div className="features">
          <div
            className="card"
            onClick={() => navigate("/post-job")}
          >
            <FaBriefcase
              size={40}
              className="icon-gradient"
            />

            <h3>Post a Job</h3>
          </div>

          <div
            className="card"
            onClick={() =>
              navigate("/manage-applicants")
            }
          >
            <FaUsers
              size={40}
              className="icon-gradient"
            />

            <h3>Manage Applicants</h3>
          </div>

          <div
            className="card"
            onClick={() => navigate("/analytics")}
          >
            <FaChartBar
              size={40}
              className="icon-gradient"
            />

            <h3>Analytics</h3>
          </div>
        </div>

        <div className="features-info">
          <h2>Why Choose Our Platform?</h2>

          <p>
            Our portal helps recruiters streamline
            hiring by managing job postings,
            tracking applicants, and analyzing
            recruitment data efficiently.
          </p>
        </div>
      </section>

      
        

      {/* Companies Section */}
      <section className="companies-section">
        <h2>Trusted by Top Companies</h2>

        <div className="marquee">
          <div className="marquee-track">
            <img
              src="/images/microsoft.png"
              alt="Microsoft"
            />

            <img
              src="/images/amazon.png"
              alt="Amazon"
            />

            <img
              src="/images/Accenture.png"
              alt="Accenture"
            />

            <img src="/images/tcs.png" alt="TCS" />

            <img
              src="/images/infosys.png"
              alt="Infosys"
            />

            <img
              src="/images/google.png"
              alt="Google"
            />

            {/* Duplicate */}
            <img
              src="/images/microsoft.png"
              alt="Microsoft"
            />

            <img
              src="/images/amazon.png"
              alt="Amazon"
            />

            <img
              src="/images/Accenture.png"
              alt="Accenture"
            />

            <img src="/images/tcs.png" alt="TCS" />

            <img
              src="/images/infosys.png"
              alt="Infosys"
            />

            <img
              src="/images/google.png"
              alt="Google"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}