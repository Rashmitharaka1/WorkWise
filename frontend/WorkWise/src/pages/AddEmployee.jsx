// src/pages/AddEmployee.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";

const AddEmployee = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    // After submission, navigate back to employees page
    navigate("/employees");
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
            <Form.Control type="text" placeholder="First Name" />
          </Col>
          <Col>
            <Form.Control type="text" placeholder="Last Name" />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Control type="date" placeholder="Date of Birth" />
          </Col>
          <Col>
            <Form.Select>
              <option>Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Form.Select>
          </Col>
        </Row>

        <h6>Contact</h6>
        <Row className="mb-3">
          <Col>
            <Form.Control type="email" placeholder="Email" />
          </Col>
          <Col>
            <Form.Control type="text" placeholder="Phone" />
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Control type="text" placeholder="Address" />
        </Form.Group>

        <h6>Job Details</h6>
        <Row className="mb-3">
          <Col>
            <Form.Control type="text" placeholder="Employee ID" />
          </Col>
          <Col>
            <Form.Select>
              <option>Department</option>
              <option>Markerting</option>
              <option>Sales</option>
              <option>Finance</option>
              <option>Human Resources</option>
              <option>IT & Support</option>
              <option >Design</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Control type="text" placeholder="Job Title" />
          </Col>
          <Col>
            <Form.Select>
              <option>Employment Type</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
            </Form.Select>
          </Col>
        </Row>

        <h6>Emergency Contact</h6>
        <Row className="mb-3">
          <Col>
            <Form.Control type="text" placeholder="Contact Name" />
          </Col>
          <Col>
            <Form.Control type="text" placeholder="Contact Phone" />
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
