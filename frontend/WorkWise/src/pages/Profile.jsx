// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("personal");
  const [uploading, setUploading] = useState(false);

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
        setFormData(data);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
      setEmployee(data);
      setFormData(data);
      alert("Employee updated successfully!");
    }
  };

  const handleCancel = () => {
    setFormData(employee);
  };

  const handlePhotoUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const filePath = `avatars/${id}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = publicData.publicUrl;

      const { data, error: updateError } = await supabase
        .from("employees")
        .update({ avatar_url: publicUrl })
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      setEmployee(data);
      setFormData(data);
      alert("Profile photo updated!");
    } catch (err) {
      console.error("Photo upload failed:", err.message);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!employee) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p>Loading profile...</p>
      </div>
    );
  }

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
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center">
          {/* Left Profile Card */}
          <div className="col-md-4 mb-3">
            <div
              className="card p-3 text-center"
              
            >
              <div className="position-relative d-inline-block">
                <img
                  src={employee.avatar_url || "https://via.placeholder.com/100"}
                  alt={employee.full_name}
                  className="rounded-circle mx-auto mb-3"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                  style={{ cursor: "pointer" }}
                  disabled={uploading}
                />
              </div>
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
    </div>
  );
}
