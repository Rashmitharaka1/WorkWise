import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaSignOutAlt
} from "react-icons/fa";
import Logo from "../assets/logo1.png";
import { supabase } from "../supabaseClient"; // make sure you have supabase client

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Supabase logout
    await supabase.auth.signOut();

    // Remove cookies/local storage if used
    localStorage.clear();
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    // Redirect to login
    navigate("/login");
  };

  return (
    <div
      className="d-flex flex-column bg-white p-3 vh-100 border-end"
      style={{ width: "220px", position: "relative" }}
    >
      {/* Logo */}
      <img
        src={Logo}
        alt="Logo"
        style={{
          position: "absolute",
          top: "-15px",
          left: "15px",
          width: "130px",
          height: "auto",
          zIndex: 10,
        }}
      />

      {/* Navigation Links */}
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
          to="/departments"
          className={({ isActive }) =>
            `d-flex align-items-center mb-3 text-decoration-none ${
              isActive
                ? "border-start border-4 border-primary ps-3 text-primary"
                : "text-secondary"
            }`
          }
        >
          <FaBuilding className="me-2" />
          Departments
        </NavLink>

        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            `d-flex align-items-center mb-3 text-decoration-none ${
              isActive
                ? "border-start border-4 border-primary ps-3 text-primary"
                : "text-secondary"
            }`
          }
        >
          <FaCalendarCheck className="me-2" />
          Attendance
        </NavLink>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="d-flex align-items-center mt-auto text-decoration-none text-secondary bg-transparent border-0 p-2"
        style={{ cursor: "pointer" }}
      >
        <FaSignOutAlt className="me-2" />
        Logout
      </button>
    </div>
  );
}
