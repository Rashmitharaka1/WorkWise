// src/pages/AddEmployee.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { supabase } from "../supabaseClient";

const AddEmployee = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    employee_id: "",
    department: "",
    job_title: "",
    employment_type: "",
    emergency_name: "",
    emergency_phone: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Insert into Supabase
    const { data, error } = await supabase.from("employees").insert([
      {
        first_name: formData.first_name,
        last_name: formData.last_name,
        full_name: formData.first_name + " " + formData.last_name,
        dob: formData.dob,
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        employee_id: formData.employee_id,
        department: formData.department,
        job_title: formData.job_title,
        employment_type: formData.employment_type,
        emergency_name: formData.emergency_name,
        emergency_phone: formData.emergency_phone,
        status: formData.status,
      },
    ]);

    if (error) {
      alert("Error adding employee: " + error.message);
      console.log(error);
    } else {
      alert("Employee added successfully!");
      navigate("/employees");
    }
  };

  return (
    <div
      className="container mt-4 p-4 bg-white rounded shadow-sm"
      style={{ maxWidth: "700px" }}
    >
      {/* Back Arrow */}
      <div
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/employees")}
        className="mb-3"
      >
        <ArrowLeft size={24} />
      </div>

      <Form onSubmit={handleSubmit}>
        <h6>Personal Info</h6>
        <Row className="mb-3">
          <Col>
            <Form.Control
              type="text"
              placeholder="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Control
              type="date"
              placeholder="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Col>
        </Row>

        <h6>Contact</h6>
        <Row className="mb-3">
          <Col>
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </Form.Group>

        <h6>Job Details</h6>
        <Row className="mb-3">
          <Col>
            <Form.Control
              type="text"
              placeholder="Employee ID"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Department</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Human Resources">Human Resources</option>
              <option value="IT & Support">IT & Support</option>
              <option value="Design">Design</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Control
              type="text"
              placeholder="Job Title"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Select
              name="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
            >
              <option value="">Employment Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </Form.Select>
          </Col>
        </Row>

        <h6>Emergency Contact</h6>
        <Row className="mb-3">
          <Col>
            <Form.Control
              type="text"
              placeholder="Contact Name"
              name="emergency_name"
              value={formData.emergency_name}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Contact Phone"
              name="emergency_phone"
              value={formData.emergency_phone}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => navigate("/employees")}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddEmployee;
