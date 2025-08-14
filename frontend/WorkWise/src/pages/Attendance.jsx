// Attendance.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ProfileIcon from "../components/ProfileIcon";
import { Table, Row, Col, Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Attendance() {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState(null);

  // Initial attendance data
  const initialData = {
    Marketing: [
      { date: "14/08/2025", name: "Manoj Silva", checkIn: "09:01", checkOut: "17:04", status: "Present" },
      { date: "14/08/2025", name: "Kavindu Perera", checkIn: "-", checkOut: "-", status: "Absent" }
    ],
    Sales: [
      { date: "14/08/2025", name: "Emily White", checkIn: "09:18", checkOut: "17:25", status: "Present" }
    ],
    Finance: [
      { date: "14/08/2025", name: "Samuel Green", checkIn: "08:45", checkOut: "16:52", status: "Present" }
    ],
    HR: [
      { date: "14/08/2025", name: "Janith Perera", checkIn: "-", checkOut: "-", status: "Absent" }
    ],
    Design: [
      { date: "14/08/2025", name: "Ayesh Fernando", checkIn: "09:10", checkOut: "17:15", status: "Present" }
    ],
    IT: [
      { date: "14/08/2025", name: "Rashmi Tharaka", checkIn: "09:00", checkOut: "17:00", status: "Present" }
    ]
  };

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const [attendanceData, setAttendanceData] = useState(deepClone(initialData));
  const [tempData, setTempData] = useState(deepClone(initialData));
  const [currentDate, setCurrentDate] = useState(getToday());

  // Get today's date in DD/MM/YYYY format
  function getToday() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  // Reset attendance at midnight automatically
  useEffect(() => {
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;

    const timeout = setTimeout(() => {
      resetAttendance();
      setInterval(resetAttendance, 24 * 60 * 60 * 1000); // Every 24 hours
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const resetAttendance = () => {
    const today = getToday();
    const resetData = {};
    for (const dept in attendanceData) {
      resetData[dept] = attendanceData[dept].map(emp => ({
        ...emp,
        date: today,
        checkIn: "-",
        checkOut: "-",
        status: "Absent"
      }));
    }
    setAttendanceData(resetData);
    setTempData(deepClone(resetData));
    setCurrentDate(today);
  };

  const departments = Object.keys(attendanceData).map(dept => ({
    name: dept,
    employees: attendanceData[dept].length
  }));

  const getSummary = () => {
    const allEmployees = Object.values(attendanceData).flat();
    const totalEmployees = allEmployees.length;
    const presentCount = allEmployees.filter(emp => emp.status === "Present").length;
    const absentCount = totalEmployees - presentCount;
    const presentPercentage = ((presentCount / totalEmployees) * 100).toFixed(1);

    const lastCheckOut = allEmployees
      .filter(emp => emp.status === "Present" && emp.checkOut && emp.checkOut !== "-")
      .map(emp => emp.checkOut)
      .sort()
      .pop() || "-";

    return [
      { title: "Attendance", count: `${presentPercentage}%` },
      { title: "Present", count: presentCount },
      { title: "Absent", count: absentCount },
      { title: "Check-Out", count: lastCheckOut }
    ];
  };

  const cards = getSummary();

  const formatTimeInput = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) return "";
    let formatted = cleaned;
    if (cleaned.length >= 3) {
      formatted = cleaned.slice(0, 2) + ":" + cleaned.slice(2, 4);
    }
    return formatted.slice(0, 5);
  };

  const isValidTime = (time) => {
    if (time === "-" || time === "") return true;
    const pattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!pattern.test(time)) return false;
    const [hh] = time.split(":").map(Number);
    return hh >= 7 && hh <= 23;
  };

  // Update only tempData, not status
  const handleInputChange = (dept, index, field, value) => {
    const updatedDept = [...tempData[dept]];
    const formatted = formatTimeInput(value);
    updatedDept[index][field] = formatted || "-";
    setTempData({ ...tempData, [dept]: updatedDept });
  };

  const handleSave = () => {
    for (const dept in tempData) {
      for (const rec of tempData[dept]) {
        if (!isValidTime(rec.checkIn) || !isValidTime(rec.checkOut)) {
          alert("Invalid time! Check again.");
          return;
        }
      }
    }

    const updatedData = {};
    for (const dept in tempData) {
      updatedData[dept] = tempData[dept].map(emp => ({
        ...emp,
        status: emp.checkIn && emp.checkIn !== "-" ? "Present" : "Absent"
      }));
    }

    setAttendanceData(updatedData);
    setTempData(deepClone(updatedData));
    alert("Attendance saved successfully!");
  };

  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="flex-grow-1 p-4 bg-light">
        {/* Header */}
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
                padding: "10px"
              }}
            >
              <div style={{ fontSize: "50px", marginTop: "-10px" }}>
                {card.count}
              </div>
              <div style={{ fontSize: "20px" }}>{card.title}</div>
            </div>
          ))}
        </div>

        {/* Department list */}
        {!selectedDept && (
          <>
            <h5 style={{ marginBottom: "15px" }}>
              Select a department to view and mark attendance
            </h5>
            <Table
              bordered
              hover
              className="bg-white"
              style={{ width: "70%", maxHeight: "300px", overflowY: "auto" }}
            >
              <thead>
                <tr>
                  <th>Department</th>
                  <th>No. of Employees</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, idx) => (
                  <tr
                    key={idx}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedDept(dept.name)}
                  >
                    <td>{dept.name}</td>
                    <td>{dept.employees}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        {/* Department attendance */}
        {selectedDept && (
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
                {tempData[selectedDept].map((rec, idx) => (
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
                        style={{ width: "90px" }}
                      />
                    </td>
                    <td
                      style={{
                        color: rec.status === "Present" ? "green" : "red",
                        fontWeight: "bold"
                      }}
                    >
                      {rec.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button
              variant="primary"
              onClick={handleSave}
              style={{ width: "90px", marginTop: "10px" }}
            >
              Save
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
