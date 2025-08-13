// Attendance.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import ProfileIcon from "../components/ProfileIcon";
import { Table, Row, Col } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Attendance() {
  const navigate = useNavigate();

  const cards = [
    { title: "Attendance", count: "98%" },
    { title: "Present", count: 110 },
    { title: "Absent", count: 10 },
    { title: "Check-Out", count: "5:04 PM" }
  ];

  const attendanceRecords = [
    {
      date: "25/08/2025",
      name: "Manoj Silva",
      department: "Marketing",
      checkIn: "9:01 AM",
      checkOut: "5:04 PM",
      status: "Present"
    },
    {
      date: "25/08/2024",
      name: "Janith Perera",
      department: "Human Resources",
      checkIn: "—",
      checkOut: "—",
      status: "Absent"
    },
    {
      date: "25/08/2024",
      name: "Samuel Green",
      department: "Product",
      checkIn: "8:45 AM",
      checkOut: "4:52 PM",
      status: "Present"
    },
    {
      date: "04/24/2024",
      name: "Emily White",
      department: "Sales",
      checkIn: "9:18 AM",
      checkOut: "5:25 PM",
      status: "Present"
    }
  ];

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
        <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
          {cards.map((card, index) => (
            <div
              key={index}
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
              <div style={{ fontSize: "50px", marginBottom: "0px", marginTop: "-10px" }}>
                {card.count}
              </div>
              <div style={{ fontSize: "20px" }}>{card.title}</div>
            </div>
          ))}
        </div>

        {/* Attendance Table */}
        <Table bordered hover className="bg-white">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Department</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{record.name}</td>
                <td>{record.department}</td>
                <td>{record.checkIn}</td>
                <td>{record.checkOut}</td>
                <td
                  style={{
                    color: record.status === "Present" ? "green" : "red",
                    fontWeight: "bold"
                  }}
                >
                  {record.status}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
