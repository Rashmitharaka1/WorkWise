import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileIcon from "../components/ProfileIcon";
import { Table, Button, Form, Row, Col, Spinner, Modal } from "react-bootstrap";
import { FaArrowLeft, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { supabase } from "../supabaseClient";

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch employees from Supabase
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

  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="flex-grow-1 p-4 bg-light">
        {/* Title & Profile */}
        <Row className="align-items-center mb-4">
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
              <div className="d-flex align-items-center border rounded px-2 bg-white">
                <FaSearch className="text-muted me-2" />
                <Form.Control type="text" placeholder="Search" className="border-0" />
              </div>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Select>
              <option>Filter by Department</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>Finance</option>
              <option>Human Resources</option>
              <option>IT & Support</option>
              <option>Design</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select>
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </Form.Select>
          </Col>
          <Col md={3} className="text-end">
            <Button variant="primary" onClick={() => navigate("/addemployee")}>
              Add Employee
            </Button>
          </Col>
        </Row>

        {/* Employee Table */}
        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table hover bordered className="bg-white">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <img
                        src={emp.avatar_url || "https://via.placeholder.com/50"}
                        alt={emp.full_name}
                        style={{ width: "50px", height: "50px", borderRadius: "10%" }}
                      />
                    </td>
                    <td>{emp.full_name}</td>
                    <td>{emp.job_title}</td>
                    <td>{emp.department}</td>
                    <td>
                      <span className={`badge ${emp.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <FaEdit
                        style={{ cursor: "pointer", marginRight: "15px", color: "blue" }}
                        onClick={() => navigate(`/editemployee/${emp.id}`)}
                      />
                      <FaTrash
                        style={{ cursor: "pointer", color: "red" }}
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

        {/* Delete Confirmation Modal */}
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
