// src/pages/Attendance.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ProfileIcon from "../components/ProfileIcon";
import { Table, Row, Col, Button, Spinner } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Attendance() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [tempData, setTempData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState(null);
  const [lastCheckout, setLastCheckout] = useState("-");

  const getDbDate = () => new Date().toISOString().split("T")[0];
  const currentDate = getDbDate();

  const getUiDate = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  // ---------- Time helpers ----------
  const normalizeTimeForSave = (time) => {
    if (!time) return null;
    const s = String(time).trim();
    if (!s) return null;

    const colonMatch = s.match(/^(\d{1,2}):(\d{1,2})(?::\d{1,2})?$/);
    if (colonMatch) {
      const hours = parseInt(colonMatch[1], 10);
      const minutes = parseInt(colonMatch[2], 10);
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }

    const digits = s.replace(/\D/g, "");
    if (!digits) return null;

    let hours, minutes;
    if (digits.length <= 2) {
      hours = parseInt(digits, 10);
      minutes = 0;
    } else if (digits.length === 3) {
      hours = parseInt(digits[0], 10);
      minutes = parseInt(digits.slice(1, 3), 10);
    } else if (digits.length === 4) {
      hours = parseInt(digits.slice(0, 2), 10);
      minutes = parseInt(digits.slice(2, 4), 10);
    } else if (digits.length === 5) {
      hours = parseInt(digits[0], 10);
      minutes = parseInt(digits.slice(1, 3), 10);
    } else if (digits.length === 6) {
      hours = parseInt(digits.slice(0, 2), 10);
      minutes = parseInt(digits.slice(2, 4), 10);
    } else return null;

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const isValidTime = (time) => !time || normalizeTimeForSave(time) !== null;

  const formatTimeInput = (value) => {
    if (!value) return "";
    const cleaned = String(value).replace(/[^\d:]/g, "");
    const parts = cleaned.split(":");
    if (parts.length > 1) {
      const h = parts[0].slice(0, 2);
      const m = parts[1].slice(0, 2);
      return m.length ? `${h}:${m}` : `${h}:${m}`;
    }
    const digits = cleaned.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length === 3) return `${digits[0]}:${digits.slice(1)}`;
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  };

  const toDisplayTime = (val) => normalizeTimeForSave(val) || "";

  // ---------- Fetch employees ----------
  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching employees:", error.message);
      setLoading(false);
      return;
    }

    const grouped = {};
    data.forEach((emp) => {
      if (!grouped[emp.department]) grouped[emp.department] = [];
      grouped[emp.department].push({
        id: emp.id,
        name: emp.full_name,
        date: getUiDate(),
        checkIn: toDisplayTime(emp.check_in),
        checkOut: toDisplayTime(emp.check_out),
        status: emp.check_in ? "Present" : "Absent",
      });
    });

    setEmployees(data);
    setAttendanceData(grouped);
    setTempData(JSON.parse(JSON.stringify(grouped)));

    const allCheckOuts = data.map((e) => toDisplayTime(e.check_out)).filter(Boolean);
    if (allCheckOuts.length > 0) setLastCheckout(allCheckOuts.sort().pop());

    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ---------- Input handling ----------
  const handleInputChange = (dept, idx, field, value) => {
    const updated = [...tempData[dept]];
    updated[idx][field] = formatTimeInput(value);
    setTempData({ ...tempData, [dept]: updated });
  };

  const handleBlur = (dept, idx, field) => {
    const updated = [...tempData[dept]];
    updated[idx][field] = normalizeTimeForSave(updated[idx][field]) || "";
    setTempData({ ...tempData, [dept]: updated });
  };

  // ---------- Save ----------
  const handleSave = async () => {
    // Validate first
    for (const dept in tempData) {
      for (const rec of tempData[dept]) {
        if (!isValidTime(rec.checkIn) || !isValidTime(rec.checkOut)) {
          alert("❌ Invalid time! Check again.");
          return; // stop save
        }
      }
    }

    let allCheckOuts = [];
    try {
      for (const dept in tempData) {
        for (const emp of tempData[dept]) {
          const checkIn = normalizeTimeForSave(emp.checkIn);
          const checkOut = normalizeTimeForSave(emp.checkOut);
          const status = checkIn ? "Present" : "Absent";
          if (checkOut) allCheckOuts.push(checkOut);

          const { error } = await supabase
            .from("employees")
            .update({ check_in: checkIn, check_out: checkOut, status })
            .eq("id", emp.id);

          if (error) throw error;

          emp.checkIn = checkIn || "";
          emp.checkOut = checkOut || "";
          emp.status = status;
        }
      }

      if (allCheckOuts.length > 0) setLastCheckout(allCheckOuts.sort().pop());

      setAttendanceData({ ...tempData });
      alert("✅ Attendance saved successfully!");
    } catch (err) {
      console.error("Error saving attendance:", err.message);
      alert("⚠️ Error saving some records!");
    }
  };

  // ---------- Summary ----------
  const getSummary = () => {
    const allEmp = Object.values(attendanceData).flat();
    const total = allEmp.length;
    const present = allEmp.filter((e) => e.status === "Present").length;
    const absent = total - present;
    const pct = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    return [
      { title: "Present % Today", count: `${pct}%` },
      { title: "Present", count: present },
      { title: "Absent", count: absent },
      { title: "Check-Out", count: lastCheckout, editable: true },
    ];
  };

  const cards = getSummary();

  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="flex-grow-1 p-4 bg-light">
        <Row className="align-items-center mb-4">
          <Col>
            <h3>
              <FaArrowLeft
                style={{ cursor: "pointer", marginRight: "10px" }}
                onClick={() => navigate("/dashboard")}
              />
              Attendance
            </h3>
          </Col>
          <Col className="text-end">
            <ProfileIcon />
          </Col>
        </Row>

        {/* Cards */}
        <div style={{ display: "flex", gap: "40px", marginBottom: "20px" }}>
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                height: "160px",
                width: "235px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #0d6efd, #ffffff)",
                color: "#063085ff",
                fontWeight: "bold",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <div style={{ fontSize: "50px", marginTop: "-10px" }}>
                {card.editable ? (
                  <input
                    type="text"
                    value={lastCheckout}
                    onChange={(e) =>
                      setLastCheckout(formatTimeInput(e.target.value))
                    }
                    onBlur={() =>
                      setLastCheckout(normalizeTimeForSave(lastCheckout) || "")
                    }
                    style={{
                      fontSize: "36px",
                      textAlign: "center",
                      border: "none",
                      background: "transparent",
                      width: "120px",
                    }}
                  />
                ) : (
                  card.count
                )}
              </div>
              <div style={{ fontSize: "20px" }}>{card.title}</div>
            </div>
          ))}
        </div>

        {/* Departments */}
        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        ) : !selectedDept ? (
          <>
            <h5 style={{ marginBottom: "15px" }}>
              Select a department to view and mark attendance
            </h5>
            <Table bordered hover className="bg-white" style={{ width: "70%" }}>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Present Employees</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(attendanceData).map((dept, idx) => {
                  const presentCount = attendanceData[dept].filter(
                    (emp) => emp.status === "Present"
                  ).length;
                  return (
                    <tr key={idx} style={{ cursor: "pointer" }} onClick={() => setSelectedDept(dept)}>
                      <td>{dept}</td>
                      <td>{presentCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        ) : (
          <>
            <h5
              style={{ cursor: "pointer", color: "blue", marginTop: "20px" }}
              onClick={() => setSelectedDept(null)}
            >
              ← Back to Departments
            </h5>
            <h4>{selectedDept} Department Attendance</h4>
            <Table bordered hover className="bg-white">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee Name</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tempData[selectedDept]?.map((rec, idx) => (
                  <tr key={idx}>
                    <td>{rec.date}</td>
                    <td>{rec.name}</td>
                    <td>
                      <input
                        type="text"
                        value={rec.checkIn}
                        onChange={(e) =>
                          handleInputChange(selectedDept, idx, "checkIn", e.target.value)
                        }
                        onBlur={() => handleBlur(selectedDept, idx, "checkIn")}
                        placeholder="e.g. 930 or 09:30"
                        style={{ width: "90px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={rec.checkOut}
                        onChange={(e) =>
                          handleInputChange(selectedDept, idx, "checkOut", e.target.value)
                        }
                        onBlur={() => handleBlur(selectedDept, idx, "checkOut")}
                        placeholder="e.g. 1730 or 17:30"
                        style={{ width: "90px" }}
                      />
                    </td>
                    <td
                      style={{
                        color: rec.status === "Present" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {rec.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="primary" onClick={handleSave} style={{ width: "90px", marginTop: "10px" }}>
              Save
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
