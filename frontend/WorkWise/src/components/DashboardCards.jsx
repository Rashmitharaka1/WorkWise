import React from "react";

export default function DashboardCards() {
  const cards = [
    { title: "Total Employees", count: 25 },
    { title: "Departments", count: 6 },
    { title: "Attendance Today", count: 18 },
  ];

  return (
    <div style={{ padding: "0px" }}>
      <div
        style={{
          display: "flex",
          gap: "40px",
          marginBottom: "40px",
          flexWrap: "wrap", // allows wrapping if screen is small
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
            }}
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
