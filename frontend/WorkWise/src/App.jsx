// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import Profile from "./pages/Profile";
import UserProfile from "./components/UserProfile";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import NotFound from "./pages/NotFound";
import Admins from "./pages/Admins";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Login />} />

      {/* Dashboard route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admins (Admin only) */}
      <Route
        path="/admins"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Admins />
          </ProtectedRoute>
        }
      />

      {/* User Profile route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      {/* Employees routes (Admin only) */}
      <Route
        path="/employees"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Employees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/addemployee"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AddEmployee />
          </ProtectedRoute>
        }
      />

      {/* Profile details by ID (optional) */}
      <Route path="/profile/:id" element={<Profile />} />

      {/* Departments (Admin only) */}
      <Route
        path="/departments"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Departments />
          </ProtectedRoute>
        }
      />

      {/* Attendance (Admin only) */}
      <Route
        path="/attendance"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Attendance />
          </ProtectedRoute>
        }
      />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
