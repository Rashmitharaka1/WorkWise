// src/pages/Employees.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileIcon from "../components/ProfileIcon";
import { Table, Button, Form, Row, Col, Spinner, Modal } from "react-bootstrap";
import { FaArrowLeft, FaTrash, FaSearch } from "react-icons/fa";
import { supabase } from "../supabaseClient";

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 🔹 Filters
  const [departmentFilter, setDepartmentFilter] = useState("Filter by Department");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState(""); // ✅ new search state

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching employees:", error.message);
    } else {
      setEmployees(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();

    const channel = supabase
      .channel("realtime-employees")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "employees" },
        () => fetchEmployees()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Delete employee
  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("employees").delete().eq("id", deleteId);
    if (error) {
      console.error("Error deleting employee:", error.message);
    } else {
      setEmployees(employees.filter((emp) => emp.id !== deleteId));
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // 🔹 Apply filters + search
  const filteredEmployees = employees.filter((emp) => {
    const departmentMatch =
      departmentFilter === "Filter by Department" || emp.department === departmentFilter;

    const statusMatch =
      statusFilter === "All Status" || emp.status === statusFilter;

    const searchMatch =
      emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchQuery.toLowerCase());

    return departmentMatch && statusMatch && searchMatch;
  });

  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="flex-grow-1 p-4 bg-light" style={{ marginLeft: "220px" }}>
        {/* Title */}
        <Row className="align-items-center mb-4 text-muted">
          <Col>
            <h3>
              <FaArrowLeft
                style={{ cursor: "pointer", marginRight: "10px" }}
                onClick={() => navigate("/dashboard")}
              />
              Employees
            </h3>
          </Col>
          <Col className="text-end">
            <ProfileIcon />
          </Col>
        </Row>

        {/* Filters & Add Button */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <div className="d-flex align-items-center border rounded px-2 bg-white ">
                <FaSearch className="text-muted me-2" />
                <Form.Control
                  type="text"
                  placeholder="Search by name, role, or department"
                  className="border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // ✅ update search
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option>Filter by Department</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>Finance</option>
              <option>HR</option>
              <option>IT & Support</option>
              <option>Design</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Present</option>
              <option>Absent</option>
            </Form.Select>
          </Col>
          <Col md={3} className="text-end">
            <Button className="btn btn-primary text-white" onClick={() => navigate("/addemployee")}>
              Add Employee
            </Button>
          </Col>
        </Row>

        {/* Employee Table */}
        {loading ? (
          <div className="text-center mt-5 ">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table hover bordered className="bg-white">
            <thead className="text-muted">
              <tr>
                <th className="text-muted">Photo</th>
                <th className="text-muted">Name</th>
                <th className="text-muted">Role</th>
                <th className="text-muted">Department</th>
                <th className="text-muted">Status</th>
                <th className="text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <img
                        src={emp.avatar_url || "https://via.placeholder.com/50"}
                        alt={emp.full_name}
                        style={{ width: "50px", height: "50px", borderRadius: "10%" }}
                      />
                    </td>
                    {/* ✅ Clickable Name → navigate to Profile */}
                    <td
                      style={{ cursor: "pointer", color: "#0d6efd" }}
                      onClick={() => navigate(`/profile/${emp.id}`)}
                    >
                      {emp.full_name}
                    </td>
                    <td>{emp.job_title}</td>
                    <td>{emp.department}</td>
                    <td>
  <span
    style={{
      display: "inline-block",
      padding: "0.35em 0.6em",
      fontSize: "0.8rem",
      
      fontWeight: 500,
      lineHeight: 1,
      color: emp.status === "Present" ? "#000" : "#721c24",
      backgroundColor: emp.status === "Present" ? "#b0dbf5ff" : "#f7c0c4ff",
      borderRadius: "0.5rem",
    }}
  >
    {emp.status}
  </span>
</td>
                    <td>
                      <FaTrash
                        style={{ cursor: "pointer", color: "red", marginLeft: "30px" }}
                        onClick={() => {
                          setDeleteId(emp.id);
                          setShowDeleteModal(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this employee?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
