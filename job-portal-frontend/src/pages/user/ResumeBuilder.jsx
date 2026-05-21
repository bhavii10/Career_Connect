import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import "./ResumeBuilder.css";
import { API_BASE_URL } from "../../config";

export default function ResumeBuilder() {

  const [data, setData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    skills: [],
    skillInput: "",
    education: "",
    experience: "",
    projects: "",
    links: "",
  });

  const [template, setTemplate] = useState("classic");

  const [message, setMessage] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const previewRef = useRef(null);

  // ================= THEME =================

  useEffect(() => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

      setDarkMode(true);

      document.documentElement.classList.add("dark");
    }

  }, []);

  const toggleDarkMode = () => {

    setDarkMode(!darkMode);

    if (!darkMode) {

      document.documentElement.classList.add("dark");

      localStorage.setItem("theme", "dark");

    } else {

      document.documentElement.classList.remove("dark");

      localStorage.setItem("theme", "light");
    }
  };

  // ================= INPUT CHANGE =================

  const onChange = (e) => {

    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= HELPERS =================

  const splitLines = (text = "") =>
    text
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);

  const skillList = data.skills || [];

  // ================= PREDEFINED SKILLS =================

  const predefinedSkills = [
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "JavaScript",
    "Java",
    "Python",
    "C++",
    "HTML",
    "CSS",
    "Tailwind",
    "Bootstrap",
    "Redux",
    "Next.js",
    "Git",
    "GitHub",
    "SQL",
    "Firebase",
    "REST API",
    "DSA",
    "SpringBoot",
    "Spring",
    "AWS",

  ];

  // ================= SKILL FUNCTIONS =================

  const addSkill = (skill) => {

    if (!skill.trim()) return;

    if (!data.skills.includes(skill)) {

      setData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
        skillInput: "",
      }));
    }
  };

  const removeSkill = (skillToRemove) => {

    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  

  // ================= SAVE TO DB =================

  const handleSaveToDB = async () => {

    if (!data.fullName?.trim() || !data.email?.trim()) {

      setMessage(
        "❗ Please provide at least your name and email before saving."
      );

      return;
    }

    setIsSaving(true);

    setMessage("");

    const payload = {

      name: data.fullName,

      fullName: data.fullName,

      email: data.email,

      phone: data.phone,

      address: data.address,

      summary: data.summary,

      skills: skillList,

      education: splitLines(data.education),

      experience: splitLines(data.experience),

      projects: splitLines(data.projects),

      links: splitLines(data.links),

      format: template,
    };

    try {

      const res = await axios.post(
        `${API_BASE_URL}/api/resumes`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201 || res.status === 200) {

        setMessage(
          "✅ Resume saved successfully to MongoDB!"
        );

      } else {

        setMessage(
          "⚠️ Unexpected response from server."
        );
      }

    } catch (err) {

      const errMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Failed to save resume.";

      setMessage(`❌ ${errMsg}`);

    } finally {

      setIsSaving(false);

      setTimeout(() => setMessage(""), 6000);
    }
  };

  // ================= DOWNLOAD PDF =================

  const handleDownloadPDF = async () => {

    if (!previewRef.current) return;

    setIsExportingPDF(true);

    const element = previewRef.current;

    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });

    const originalOverflow = element.style.overflow;
    const originalMaxHeight = element.style.maxHeight;
    const originalHeight = element.style.height;

    element.style.overflow = "visible";
    element.style.maxHeight = "none";
    element.style.height = "auto";

    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",

      width: element.scrollWidth,
      height: element.scrollHeight,

      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,

      scrollX: 0,
      scrollY: 0,
    });

    element.style.overflow = originalOverflow;
    element.style.maxHeight = originalMaxHeight;
    element.style.height = originalHeight;

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth =
      pdf.internal.pageSize.getWidth();

    const pdfHeight =
      pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;

    const imgHeight =
      (canvas.height * imgWidth) /
      canvas.width;

    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {

      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pdfHeight;
    }

    pdf.save(
      `${data.fullName || "resume"}.pdf`
    );

    setIsExportingPDF(false);
  };

  return (

    <div className={`rb-wrapper ${darkMode ? "dark" : ""}`}>

      <h1 className="rb-title">
        📄 Resume Builder
      </h1>

      {/* CONTROLS */}

      <div className="rb-controls">

        <div className="rb-template-select">

          <label>
            Resume Format / Template:
          </label>

          <select
            value={template}
            onChange={(e) =>
              setTemplate(e.target.value)
            }
          >
            <option value="classic">
              Classic (Clean & Compact)
            </option>

            <option value="modern">
              Modern (Accent & Sidebar)
            </option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >

          <button
            className="rb-download-btn"
            type="button"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>

          <button
            className="rb-save-btn"
            type="button"
            onClick={handleSaveToDB}
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : "Save to Database"}
          </button>

          <button
            className="rb-dark-btn"
            type="button"
            onClick={toggleDarkMode}
          >
            {darkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {message && (
        <div className="rb-message">
          {message}
        </div>
      )}

      {/* GRID */}

      <div className="rb-grid">

        {/* FORM */}

        <form
          className="rb-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveToDB();
          }}
        >

          <h2>Personal Info</h2>

          <div className="rb-row">
            <label>Full Name</label>

            <input
              name="fullName"
              value={data.fullName}
              onChange={onChange}
              placeholder="Balreet Singh"
              required
            />
          </div>

          <div className="rb-row rb-2col">

            <div>
              <label>Email</label>

              <input
                name="email"
                value={data.email}
                onChange={onChange}
                type="email"
                required
              />
            </div>

            <div>
              <label>Phone</label>

              <input
                name="phone"
                value={data.phone}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="rb-row">

            <label>Address</label>

            <input
              name="address"
              value={data.address}
              onChange={onChange}
            />
          </div>

          {/* SUMMARY */}

          <h2>Summary</h2>

          <div className="rb-row">

            <textarea
              name="summary"
              value={data.summary}
              onChange={onChange}
              rows={3}
            />
          </div>

          {/* SKILLS */}

          <h2>Skills</h2>

          <div className="rb-row">

            <div className="skills-input-wrapper">

              <input
                type="text"
                placeholder="Search or add skill..."
                value={data.skillInput}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    skillInput: e.target.value,
                  }))
                }
                onKeyDown={(e) => {

                  if (e.key === "Enter") {

                    e.preventDefault();

                    addSkill(data.skillInput);
                  }
                }}
              />

              <button
                type="button"
                className="add-skill-btn"
                onClick={() =>
                  addSkill(data.skillInput)
                }
              >
                Add
              </button>
            </div>

            {/* Suggestions */}

            {data.skillInput && (

              <div className="skills-dropdown">

                {predefinedSkills
                  .filter((skill) =>
                    skill
                      .toLowerCase()
                      .includes(
                        data.skillInput.toLowerCase()
                      )
                  )
                  .map((skill, index) => (

                    <div
                      key={index}
                      className="skill-option"
                      onClick={() => addSkill(skill)}
                    >
                      {skill}
                    </div>
                  ))}
              </div>
            )}

            {/* Selected Skills */}

            <div className="selected-skills">

              {skillList.map((skill, index) => (

                <div
                  key={index}
                  className="selected-skill-chip"
                >
                  {skill}

                  <span
                    onClick={() =>
                      removeSkill(skill)
                    }
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* EDUCATION */}

          <h2>Education</h2>

          <div className="rb-row">

            <textarea
              name="education"
              value={data.education}
              onChange={onChange}
              rows={4}
            />
          </div>

          {/* EXPERIENCE */}

          <h2>Experience</h2>

          <div className="rb-row">

            <textarea
              name="experience"
              value={data.experience}
              onChange={onChange}
              rows={5}
            />
          </div>

          {/* PROJECTS */}

          <h2>Projects</h2>

          <div className="rb-row">

            <textarea
              name="projects"
              value={data.projects}
              onChange={onChange}
              rows={4}
            />
          </div>

          {/* LINKS */}

          <h2>Links</h2>

          <div className="rb-row">

            <textarea
              name="links"
              value={data.links}
              onChange={onChange}
              rows={3}
            />
          </div>

          <div style={{ marginTop: 14 }}>

            <button
              type="submit"
              className="rb-save-btn"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : "Save to Database"}
            </button>
          </div>
        </form>

        {/* PREVIEW */}

        <div className="rb-preview-wrapper">

          <div
            ref={previewRef}
            className={`rb-preview a4 ${
              template === "modern"
                ? "tpl-modern"
                : "tpl-classic"
            } ${
              isExportingPDF
                ? "pdf-mode"
                : ""
            }`}
          >

            {/* CLASSIC */}

            {template === "classic" ? (

              <div className="tpl-classic-inner">

                <header className="c-header">

                  <h2>
                    {data.fullName || "Your Name"}
                  </h2>

                  <div className="c-sub">
                    {data.email} • {data.phone} •{" "}
                    {data.address}
                  </div>
                </header>

                {data.summary && (
                  <section className="c-section">
                    <h3>Summary</h3>
                    <p>{data.summary}</p>
                  </section>
                )}

                {skillList.length > 0 && (
                  <section className="c-section">
                    <h3>Skills</h3>

                    <div className="chip-row">

                      {skillList.map((skill, index) => (

                        <span
                          key={index}
                          className="chip"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* EXPERIENCE */}

{data.experience && (
  <section className="c-section">

    <h3>Experience</h3>

    <ul className="bullet-list">

      {splitLines(data.experience).map(
        (item, index) => (
          <li key={index}>
            {item}
          </li>
        )
      )}
    </ul>
  </section>
)}

{/* PROJECTS */}

{data.projects && (
  <section className="c-section">

    <h3>Projects</h3>

    <ul className="bullet-list">

      {splitLines(data.projects).map(
        (item, index) => (
          <li key={index}>
            {item}
          </li>
        )
      )}
    </ul>
  </section>
)}

{/* EDUCATION */}

{data.education && (
  <section className="c-section">

    <h3>Education</h3>

    <ul className="bullet-list">

      {splitLines(data.education).map(
        (item, index) => (
          <li key={index}>
            {item}
          </li>
        )
      )}
    </ul>
  </section>
)}

{/* LINKS */}

{data.links && (
  <section className="c-section">

    <h3>Links</h3>

    <ul className="bullet-list">

      {splitLines(data.links).map(
        (item, index) => (
          <li key={index}>
            {item}
          </li>
        )
      )}
    </ul>
  </section>
)}

              </div>

            ) : (

              /* MODERN */

              <div className="tpl-modern-grid">

                <aside className="tpl-modern-sidebar">

                  <div className="m-name">
                    {data.fullName || "Your Name"}
                  </div>

                  <div className="m-contact">
                    <div>{data.email}</div>
                    <div>{data.phone}</div>
                    <div>{data.address}</div>
                  </div>

                  <div className="m-section">

                    <h4>Skills</h4>

                    <ul className="pill-list">

                      {skillList.map((skill, index) => (

                        <li key={index}>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {data.links && (

                    <div className="m-section">

                      <h4>Links</h4>

                      <ul className="bullet-list">

                        {splitLines(data.links).map(
                          (link, index) => (
                            <li key={index}>
                              {link}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </aside>

                <main className="tpl-modern-main">

                  {data.summary && (
                    <section>
                      <h3>Summary</h3>
                      <p>{data.summary}</p>
                    </section>
                  )}

                  {data.experience && (
                    <section>
                      <h3>Experience</h3>

                      <ul className="bullet-list">

                        {splitLines(
                          data.experience
                        ).map((item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {data.projects && (
                    <section>
                      <h3>Projects</h3>

                      <ul className="bullet-list">

                        {splitLines(
                          data.projects
                        ).map((item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {data.education && (
                    <section>
                      <h3>Education</h3>

                      <ul className="bullet-list">

                        {splitLines(
                          data.education
                        ).map((item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </main>
              </div>
            )}
          </div>

          <div className="rb-note">
            Tip: Switch templates before downloading.
          </div>
        </div>
      </div>
    </div>
  );
}