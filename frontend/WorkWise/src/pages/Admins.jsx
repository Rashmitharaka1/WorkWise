// src/pages/Admins.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Form, Card, Row, Col, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { FaTrash, FaArrowLeft, FaSearch } from "react-icons/fa";

export default function Admins() {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    employee_id: "",
    department: "",
  });

  // Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("admins").select("*");

      if (error) {
        console.error("Error fetching admins:", error.message);
      } else {
        setAdmins(data || []);
      }
      setLoading(false);
    };

    fetchAdmins();
  }, []);

  // Add new admin
  const handleSave = async () => {
    if (!formData.full_name || !formData.email) {
      alert("Please fill all required fields");
      return;
    }

    const { data, error } = await supabase
      .from("admins")
      .insert([formData])
      .select();

    if (error) {
      alert("Error adding admin: " + error.message);
    } else if (data) {
      setAdmins([...admins, ...data]);
    }
    setShowForm(false);
    setFormData({ full_name: "", email: "", employee_id: "", department: "" });
  };

  // Delete admin
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this admin?")) return;

    const { error } = await supabase.from("admins").delete().eq("id", id);

    if (error) {
      alert("Error deleting admin: " + error.message);
    } else {
      setAdmins(admins.filter((a) => a.id !== id));
    }
  };

  // Filtered admins
  const filteredAdmins = admins.filter(
    (a) =>
      a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        width: "60%",
        marginLeft: "230px",
        border: "1px solid #dee2e6",
        borderRadius: "0.25rem",
        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
      }}
    >
      {/* Title with back button */}
      <div className="d-flex align-items-center mb-4">
        <FaArrowLeft
          style={{ cursor: "pointer", marginRight: "12px" }}
          onClick={() => navigate("/dashboard")}
        />
        <h3 className="mb-0 text-muted">System Admins</h3>
      </div>

      {/* Search and Add Admin button in one row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Search bar */}
        <InputGroup style={{ maxWidth: "250px" }}>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        {/* Add Admin button */}
        <Button size="sm" onClick={() => setShowForm(true)} style={{ maxWidth: "200px" }}>
          + Add Admin
        </Button>
      </div>

      {/* Admins Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="text-muted">Full Name</th>
            <th className="text-muted">Email</th>
            <th className="text-muted">Employee ID</th>
            <th className="text-muted">Department</th>
            <th className="text-muted" style={{ width: "80px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                {loading ? "Loading..." : "No admins found"}
              </td>
            </tr>
          ) : (
            filteredAdmins.map((admin) => (
              <tr key={admin.id}>
                <td className="text-muted">{admin.full_name}</td>
                <td className="text-muted">{admin.email}</td>
                <td className="text-muted">{admin.employee_id}</td>
                <td className="text-muted">{admin.department}</td>
                <td className="text-muted">
                  <FaTrash
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDelete(admin.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Add Admin Form (centered overlay) */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
        >
          <Card className="shadow p-4" style={{ width: "450px" }}>
            <h5 className="mb-3 text-center">Add New Admin</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Employee ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter employee ID"
                  value={formData.employee_id}
                  onChange={(e) =>
                    setFormData({ ...formData, employee_id: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
              </Form.Group>
              <div className="d-flex justify-content-between gap-3">
                <Button className="btn btn-info text-white" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button className="btn btn-info text-white" onClick={handleSave}>
                  Save Admin
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      )}
    </div>
  );
}
