import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import ProfileIcon from "../components/ProfileIcon";

export default function Dashboard() {
  return (
    <div className="d-flex" style={{ position: "relative" }}>
      <Sidebar />
      <div
        className="flex-grow-1 p-4"
        style={{ backgroundColor: "#f8f9fa", position: "relative" }}
      >
        <ProfileIcon /> {/* Top-right profile icon */}
        <DashboardCards />
      </div>
    </div>
  );
}
