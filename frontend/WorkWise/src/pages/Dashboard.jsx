import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";

export default function Dashboard() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        <DashboardCards />
      </div>
    </div>
  );
}
