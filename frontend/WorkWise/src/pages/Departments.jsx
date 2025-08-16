// src/pages/Departments.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ProfileIcon from "../components/ProfileIcon";
import { Table, Row, Col, Spinner } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Departments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);

  // ✅ Fetch employees and count by department
  const fetchDepartments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("employees")
      .select("department");

    if (error) {
      console.error("Error fetching departments:", error.message);
      setLoading(false);
      return;
    }

    // Count employees per department
    const deptCount = {};
    data.forEach((emp) => {
      if (emp.department) {
        deptCount[emp.department] = (deptCount[emp.department] || 0) + 1;
      }
    });

    const formatted = Object.keys(deptCount).map((dept) => ({
      name: dept,
      employees: deptCount[dept],
    }));

    setDepartments(formatted);
    setTotalEmployees(data.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartments();

    // ✅ Realtime updates
    const channel = supabase
      .channel("realtime-departments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "employees" },
        () => {
          fetchDepartments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="flex-grow-1 p-4 bg-light">
        {/* Header */}
        <Row className="align-items-center mb-4">
          <Col>
            <h3>
              <FaArrowLeft
                style={{ cursor: "pointer", marginRight: "10px" }}
                onClick={() => navigate("/dashboard")}
              />
              Departments
            </h3>
          </Col>
          <Col className="text-end">
            <ProfileIcon />
          </Col>
        </Row>

        {/* Cards */}
        <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
          <div
            style={{
              height: "160px",
              width: "235px",
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
            <div style={{ fontSize: "70px", marginBottom: "0px", marginTop: "-20px" }}>
              {totalEmployees}
            </div>
            <div style={{ fontSize: "20px" }}>Total Employees</div>
          </div>

          <div
            style={{
              height: "160px",
              width: "235px",
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
            <div style={{ fontSize: "70px", marginBottom: "0px", marginTop: "-20px" }}>
              {departments.length}
            </div>
            <div style={{ fontSize: "20px" }}>Departments</div>
          </div>
        </div>

        {/* Departments Table */}
        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table bordered hover className="bg-white">
            <thead>
              <tr>
                <th>Name</th>
                <th>Employees</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((dept, index) => (
                  <tr key={index}>
                    <td>{dept.name}</td>
                    <td>{dept.employees}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
