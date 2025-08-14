// ProfilePage.js
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal");

  const attendanceData = [
    { date: "2025-08-01", status: "Present" },
    { date: "2025-08-02", status: "Absent" },
    { date: "2025-08-03", status: "Present" },
  ];

  const performanceData = [
    { month: "July 2025", rating: "Excellent" },
    { month: "June 2025", rating: "Good" },
  ];

  const documentsData = [
    { name: "Resume.pdf", link: "#" },
    { name: "Contract.docx", link: "#" },
  ];

  return (
    <div className="container py-4">
      <div className="row">
        {/* Left Profile Card */}
        <div className="col-md-4">
          <div className="card p-3 text-center" style={{ backgroundColor: "#eaf2fb" }}>
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="rounded-circle mx-auto mb-3"
            />
            <h5>Jane Doe</h5>
            <p className="mb-1">UI/UX Designer</p>
            <p className="text-muted">Design</p>
            <hr />
            <p className="mb-1">
              <i className="bi bi-envelope"></i> jane.doe@example.com
            </p>
            <p>
              <i className="bi bi-telephone"></i> +1 234-567 8900
            </p>
          </div>
        </div>

        {/* Right Content */}
        <div className="col-md-8">
          {/* Tabs */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "personal" ? "active" : ""}`}
                onClick={() => setActiveTab("personal")}
              >
                Personal Info
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "attendance" ? "active" : ""}`}
                onClick={() => setActiveTab("attendance")}
              >
                Attendance
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "performance" ? "active" : ""}`}
                onClick={() => setActiveTab("performance")}
              >
                Performance
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "documents" ? "active" : ""}`}
                onClick={() => setActiveTab("documents")}
              >
                Documents
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="card p-3">
            {activeTab === "personal" && (
              <form>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" defaultValue="Jane Doe" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" defaultValue="jane.doe@example.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" defaultValue="123 Main St, Springfield" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input type="text" className="form-control" defaultValue="January 15, 1985" />
                </div>
                <div>
                  <button type="button" className="btn btn-secondary me-2">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            )}

            {activeTab === "attendance" && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.date}</td>
                      <td>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "performance" && (
              <ul className="list-group">
                {performanceData.map((perf, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    <span>{perf.month}</span>
                    <strong>{perf.rating}</strong>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "documents" && (
              <ul className="list-group">
                {documentsData.map((doc, index) => (
                  <li key={index} className="list-group-item">
                    <a href={doc.link} download>{doc.name}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
