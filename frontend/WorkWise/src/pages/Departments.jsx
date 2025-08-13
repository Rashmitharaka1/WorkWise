import React from "react";
import Sidebar from "../components/Sidebar";
import ProfileIcon from "../components/ProfileIcon";
import { Table, Row, Col } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ Import

export default function Departments() {
  const navigate = useNavigate(); // ✅ Create navigate function

  const cards = [
    { title: "Total Employees", count: 25 },
    { title: "Departments", count: 6 },
    { title: "Attendance Today", count: 18 },
    { title: "Pending Requests", count: 7 }
  ];

  const departments = [
    { name: "Marketing", employees: 10 },
    { name: "Finance", employees: 20 },
    { name: "Sales", employees: 12 },
    { name: "Design", employees: 15 },
    { name: "Human Resources", employees: 15 },
    { name: "IT & Support", employees: 10 },
    
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
                onClick={() => navigate("/dashboard")} // ✅ Works now
              />
              Departments
            </h3>
          </Col>
          <Col className="text-end">
            <ProfileIcon />
          </Col>
        </Row>

        {/* Cards in one row */}
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
              <div style={{ fontSize: "70px", marginBottom: "0px", marginTop: "-20px" }}>
                {card.count}
              </div>
              <div style={{ fontSize: "20px" }}>{card.title}</div>
            </div>
          ))}
        </div>

        {/* Departments Table */}
        <Table bordered hover className="bg-white">
          <thead>
            <tr>
              <th>Name</th>
              <th>Employees</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => (
              <tr key={index}>
                <td>{dept.name}</td>
                <td>{dept.employees}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
