import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import Logo from "../assets/logo1.png";

export default function Sidebar() {
  return (
    <div
      className="d-flex flex-column bg-white p-3 vh-100 border-end"
      style={{ width: "220px", position: "relative" }}
    >
      <img
        src={Logo}
        alt="Logo"
        style={{
          position: "absolute",
          top: "-10px",
          left: "20px",
          width: "130px",
          height: "auto",
          zIndex: 10,
        }}
      />

      <nav style={{ marginTop: "80px" }}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `d-flex align-items-center mb-3 text-decoration-none ${
              isActive
                ? "border-start border-4 border-primary ps-3 text-primary"
                : "text-secondary"
            }`
          }
        >
          <FaTachometerAlt className="me-2" />
          Dashboard
        </NavLink>

        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `d-flex align-items-center mb-3 text-decoration-none ${
              isActive
                ? "border-start border-4 border-primary ps-3 text-primary"
                : "text-secondary"
            }`
          }
        >
          <FaUsers className="me-2" />
          Employees
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `d-flex align-items-center mb-3 text-decoration-none ${
              isActive
                ? "border-start border-4 border-primary ps-3 text-primary"
                : "text-secondary"
            }`
          }
        >
          <FaCog className="me-2" />
          Settings
        </NavLink>
      </nav>

      <NavLink
        to="/logout"
        className="d-flex align-items-center mt-auto text-decoration-none text-secondary"
      >
        <FaSignOutAlt className="me-2" />
        Logout
      </NavLink>
    </div>
  );
}
