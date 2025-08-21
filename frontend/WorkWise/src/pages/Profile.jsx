// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const { id } = useParams(); // get employee id from URL
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("personal");

  // Fetch employee by id
  useEffect(() => {
    const fetchEmployee = async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching employee:", error.message);
      } else {
        setEmployee(data);
        setFormData(data); // initialize form with employee data
      }
    };
    fetchEmployee();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes
  const handleSave = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("employees")
      .update(formData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating employee:", error.message);
      alert("Failed to update employee.");
    } else {
      setEmployee(data); // update local state with saved data
      setFormData(data); // reset formData to saved version
      alert("Employee updated successfully!");
    }
  };

  // Cancel changes (reset form)
  const handleCancel = () => {
    setFormData(employee); // restore last saved data
  };

  if (!employee) {
    return <div className="container py-4">Loading profile...</div>;
  }

  // Dummy data for now (replace later with real attendance/performance tables)
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
    <div className="container py-5">
      <div className="row">
        {/* Left Profile Card */}
        <div className="col-md-4">
          <div
            className="card p-3 text-center"
            style={{ backgroundColor: "#eaf2fb" }}
          >
            <img
              src={employee.avatar_url || "https://via.placeholder.com/100"}
              alt={employee.full_name}
              className="rounded-circle mx-auto mb-3"
              style={{ width: "100px", height: "100px" }}
            />
            <h5>{employee.full_name}</h5>
            <p className="mb-1">{employee.job_title}</p>
            <p className="text-muted">{employee.department}</p>
            <hr />
            <p className="mb-1">
              <i className="bi bi-envelope"></i> {employee.email || "N/A"}
            </p>
            <p>
              <i className="bi bi-telephone"></i> {employee.phone || "N/A"}
            </p>
          </div>
        </div>

        {/* Right Content */}
        <div className="col-md-6">
          {/* Tabs */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "personal" ? "active" : ""
                }`}
                onClick={() => setActiveTab("personal")}
              >
                Personal Info
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "attendance" ? "active" : ""
                }`}
                onClick={() => setActiveTab("attendance")}
              >
                Attendance
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "performance" ? "active" : ""
                }`}
                onClick={() => setActiveTab("performance")}
              >
                Performance
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "documents" ? "active" : ""
                }`}
                onClick={() => setActiveTab("documents")}
              >
                Documents
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="card p-3">
            {activeTab === "personal" && (
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="full_name"
                    value={formData.full_name || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
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
                  {attendanceData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.date}</td>
                      <td>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "performance" && (
              <ul className="list-group">
                {performanceData.map((perf, i) => (
                  <li
                    key={i}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{perf.month}</span>
                    <strong>{perf.rating}</strong>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "documents" && (
              <ul className="list-group">
                {documentsData.map((doc, i) => (
                  <li key={i} className="list-group-item">
                    <a href={doc.link} download>
                      {doc.name}
                    </a>
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
