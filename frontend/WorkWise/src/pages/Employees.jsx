// Employees.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileIcon from "../components/ProfileIcon";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { FaArrowLeft, FaEdit, FaExternalLinkAlt, FaSearch } from "react-icons/fa";

// Profile images
import profile1 from "../assets/profile1.jpg";
import profile2 from "../assets/profile2.jpg";
import profile3 from "../assets/profile3.jpg";
import profile4 from "../assets/profile4.jpg";
import profile5 from "../assets/profile5.jpg";

const employeesData = [
  { photo: profile1, name: "Manoj Silva", role: "Marketing Manager", department: "Marketing", status: "Active" },
  { photo: profile2, name: "Janith Perera", role: "HR Manager", department: "Human Resources", status: "Active" },
  { photo: profile3, name: "Malsha Hansani", role: "Sales Representative", department: "Sales", status: "Active" },
  { photo: profile4, name: "Supun Perera", role: "Product Design", department: "Design", status: "Inactive" },
  { photo: profile5, name: "Rashmi Seya", role: "Software Engineer", department: "IT & Support", status: "Active" },
  { photo: profile5, name: "Sadi Perera", role: "Accountant", department: "Finance", status: "Inactive" },
];

export default function Employees() {
  const navigate = useNavigate();

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light">
        
        {/* Top Row - Title & Profile */}
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

        {/* Search & Filters */}
        <Row className="mb-3">
          {/* Search Box with Icon */}
          <Col md={4}>
            <Form.Group>
              <div className="d-flex align-items-center border rounded px-2 bg-white">
                <FaSearch className="text-muted me-2" />
                <Form.Control
                  type="text"
                  placeholder="Search"
                  className="border-0 "
                />
              </div>
            </Form.Group>
          </Col>

          {/* Department Filter */}
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

          {/* Status Filter */}
          <Col md={2}>
            <Form.Select>
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </Form.Select>
          </Col>

          {/* Add Employee Button */}
          <Col md={3} className="text-end">
            <Button variant="primary">Add Employee</Button>
          </Col>
        </Row>

        {/* Employee Table */}
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
            {employeesData.map((emp, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={emp.photo}
                    alt={emp.name}
                    style={{ width: "50px", height: "50px", borderRadius: "10%" }}
                  />
                </td>
                <td>{emp.name}</td>
                <td>{emp.role}</td>
                <td>{emp.department}</td>
                <td>
                  <span
                    className={`badge ${
                      emp.status === "Active" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td>
                  <FaEdit
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  />
                  <FaExternalLinkAlt style={{ cursor: "pointer" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
