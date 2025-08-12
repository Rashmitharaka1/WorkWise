import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div
      className="d-flex flex-column bg-white p-3 vh-100 border-end"
      style={{ width: "220px" }}
    >
      <h4 className="text-primary py-3 mb-4">WorkWise</h4>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `d-flex align-items-center mb-3 text-decoration-none ${
            isActive ? "border-start border-4 border-primary ps-3 text-primary" : "text-secondary"
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
            isActive ? "border-start border-4 border-primary ps-3 text-primary" : "text-secondary"
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
            isActive ? "border-start border-4 border-primary ps-3 text-primary" : "text-secondary"
          }`
        }
      >
        <FaCog className="me-2" />
        Settings
      </NavLink>

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
