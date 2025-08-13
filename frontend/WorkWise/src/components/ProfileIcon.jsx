// src/components/ProfileIcon.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function ProfileIcon() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "40px",
        cursor: "pointer",
        color: "#0d6efd",
        zIndex: 1000,
      }}
      onClick={() => navigate("/profile")}
      title="Go to Profile"
    >
      <FaUserCircle size={40} />
    </div>
  );
}
