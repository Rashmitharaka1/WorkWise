import React from "react";

export default function DashboardCards() {
  const cards = [
    { title: "Card 1", color: "primary" },
    { title: "Card 2", color: "success" },
    { title: "Card 3", color: "warning" },
    { title: "Card 4", color: "danger" }
  ];

  return (
    <div className="container">
      <h2 className="mb-4">Dashboard</h2>
      <div className="row">
        {cards.map((card, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div
              className={`card text-white bg-${card.color} d-flex align-items-center justify-content-center`}
              style={{ height: "150px", borderRadius: "8px" }}
            >
              <h5 className="card-title">{card.title}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
