// src/components/DashboardCards.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardCards({ employeeCount, attendanceToday }) {
  const navigate = useNavigate();

  const safeAttend = Number.isFinite(attendanceToday) ? attendanceToday : 0;
  const safeEmployees = Number.isFinite(employeeCount) ? employeeCount : 0;

  const cards = [
    { title: "Total Employees", count: safeEmployees },
    { title: "Departments", count: 6 },
    { title: "Present Today", count: safeAttend },
    { title: "Manage Admins", count: "👤" }, // new card
  ];

  const handleCardClick = (title) => {
    if (title === "Manage Admins") {
      navigate("/admins"); // ✅ navigate to Admins.jsx
    }
  };

  return (
    <div style={{ padding: "0px" }}>
      <div
        style={{
          display: "flex",
          gap: "40px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              height: "160px",
              width: "240px",
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
              cursor: card.title === "Manage Admins" ? "pointer" : "default",
            }}
            onClick={() => handleCardClick(card.title)}
          >
            <div
              style={{
                fontSize: "70px",
                marginBottom: "0px",
                marginTop: "-20px",
              }}
            >
              {card.count}
            </div>
            <div style={{ fontSize: "20px" }}>{card.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
