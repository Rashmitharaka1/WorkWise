import React, { useState, useEffect } from "react";
import { Table, Button, Form, Card, Modal, Spinner } from "react-bootstrap";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";

export default function Admins() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    employee_id: "",
    department: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Fetch profiles
  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) {
      console.error("Error fetching profiles:", error.message);
    } else {
      setProfiles(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Check if email already exists in auth
      const { data: existingUser, error: checkAuthError } =
        await supabase.auth.admin.listUsers();
      if (checkAuthError) throw checkAuthError;

      const emailExists = existingUser.users.some(
        (u) => u.email === formData.email
      );
      if (emailExists) {
        alert("❌ Email already exists!");
        return;
      }

      // Create user in auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
      });
      if (error) throw error;

      const userId = data.user.id;

      // Update profile (auto-created by trigger)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          email: formData.email,
          full_name: formData.full_name,
          phone: formData.phone,
          employee_id: formData.employee_id,
          department: formData.department,
        })
        .eq("id", userId);
      if (profileError) throw profileError;

      alert("✅ User created!");
      setFormData({
        email: "",
        password: "",
        full_name: "",
        phone: "",
        employee_id: "",
        department: "",
      });
      setShowForm(false);
      fetchProfiles();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const { error } = await supabase.auth.admin.deleteUser(id);
      if (error) throw error;
      alert("✅ User deleted!");
      fetchProfiles();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center">
        <Card className="p-4 w-100">
          {/* Back Arrow + Title */}
          <div className="d-flex align-items-center mb-3">
            <FaArrowLeft
              style={{ cursor: "pointer",  fontSize: "1.2rem" }}
              onClick={() => navigate("/dashboard")}
              className="me-3 text-muted"
            />
            <h3 className="mb-0 text-muted">System Admins</h3>
            <div className="ms-auto">
              <Button
                variant="primary"
                onClick={() => setShowForm(true)}
                style={{ width: "150px" }}
              >
                Add Admin
              </Button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-muted">Full Name</th>
                  <th className="text-muted">Employee ID</th>
                  <th className="text-muted">Department</th>
                  <th className="text-muted">Email</th>
                  <th className="text-muted">Phone</th>
                  <th className="text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {profiles.length > 0 ? (
                  profiles.map((profile) => (
                    <tr key={profile.id}>
                      <td className="text-muted">{profile.full_name}</td>
                      <td className="text-muted">{profile.employee_id}</td>
                      <td className="text-muted">{profile.department}</td>
                      <td className="text-muted">{profile.email}</td>
                      <td className="text-muted">{profile.phone}</td>
                      <td>
                        <FaTrash style={{ fontSize: "1rem", color: "red" }} onClick={() => handleDeleteUser(profile.id)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No admins found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card>
      </div>

      {/* Add User Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Form id="addUserForm" onSubmit={handleAddUser}>
            <Form.Group >
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee ID"
                value={formData.employee_id}
                onChange={(e) =>
                  setFormData({ ...formData, employee_id: e.target.value })
                }
                required
                autocomplete="off"
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                autocomplete="off"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          
          <Button
            type="submit"
            variant="success"
            form="addUserForm"
            style={{ width: "150px" }}
          >
            Add Admin
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}