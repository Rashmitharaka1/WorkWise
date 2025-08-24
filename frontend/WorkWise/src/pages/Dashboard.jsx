// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import ProfileIcon from "../components/ProfileIcon";
import UserProfile from "../components/UserProfile";
import {
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Counts
  const [employeeCount, setEmployeeCount] = useState(0);
  const [attendanceToday, setAttendanceToday] = useState(0);

  // Event modal state
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [formData, setFormData] = useState({ date: "", event: "" });

  // User profile modal state
  const [showProfile, setShowProfile] = useState(false);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error.message);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  // ✅ Fetch employee count
  useEffect(() => {
    const fetchEmployeeCount = async () => {
      try {
        const { count, error } = await supabase
          .from("employees")
          .select("*", { count: "exact", head: true });
        if (error) throw error;
        setEmployeeCount(count || 0);
      } catch (err) {
        console.error("Error fetching employees:", err.message);
        setEmployeeCount(0);
      }
    };
    fetchEmployeeCount();
  }, []);

  // ✅ Fetch Present Today (from Supabase not just localStorage)
  useEffect(() => {
    const fetchAttendanceToday = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const { count, error } = await supabase
          .from("employees")
          .select("*", { count: "exact", head: true })
          .eq("status", "Present"); // optional: add `.eq("date", today)` if attendance stored per-day

        if (error) throw error;
        setAttendanceToday(count || 0);

        // also sync into localStorage so Attendance.jsx & Dashboard stay consistent
        localStorage.setItem("presentToday", count || 0);
        window.dispatchEvent(new Event("presentTodayUpdated"));
      } catch (err) {
        console.error("Error fetching attendance:", err.message);
        setAttendanceToday(0);
      }
    };

    fetchAttendanceToday();
  }, []);

  // Open modal
  const handleShowModal = (eventObj = null) => {
    setEditEvent(eventObj);
    if (eventObj) {
      setFormData({ date: eventObj.date, event: eventObj.event });
    } else {
      setFormData({ date: "", event: "" });
    }
    setShowModal(true);
  };

  // Save event
  const handleSave = async () => {
    if (!formData.date || !formData.event) return;

    if (editEvent) {
      const { error } = await supabase
        .from("events")
        .update({ date: formData.date, event: formData.event })
        .eq("id", editEvent.id);

      if (error) alert("Error updating event: " + error.message);
      else {
        setEvents(
          events.map((e) =>
            e.id === editEvent.id ? { ...e, ...formData } : e
          )
        );
      }
    } else {
      const { data, error } = await supabase
        .from("events")
        .insert([{ date: formData.date, event: formData.event }])
        .select();

      if (error) alert("Error adding event: " + error.message);
      else if (data) setEvents([...events, ...data]);
    }

    setShowModal(false);
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) alert("Error deleting event: " + error.message);
    else setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <div className="d-flex" style={{ position: "relative", marginLeft: "230px" }}>
      <Sidebar />
      <div
        className="flex-grow-1 p-4"
        style={{ backgroundColor: "#f8f9fa", position: "relative" }}
      >
        {/* Top-right profile icon */}
        <div style={{ position: "absolute", top: 0, right: 0 }}>
          <ProfileIcon onClick={() => setShowProfile(true)} />
        </div>

        <h2 className="mb-5 text-muted">Welcome to WorkWise!</h2>

        {/* ✅ Dashboard Cards */}
        <DashboardCards
          employeeCount={employeeCount}
          attendanceToday={attendanceToday}
        />

        {/* Events */}
        <Row className="mt-4">
          <Col md={12}>
            <Card className="shadow-sm p-3">
              <div className="d-flex justify-content-between align-items-center mb-2 text-muted">
                <h5>Upcoming Events</h5>
                <FaPlus
                  style={{ cursor: "pointer", color: "green" }}
                  onClick={() => handleShowModal()}
                  title="Add Event"
                />
              </div>

              {loading ? (
                <div className="text-center my-3 ">
                  <Spinner animation="border" />
                </div>
              ) : (
                <ListGroup variant="flush">
                  {events.map((e) => (
                    <ListGroup.Item
                      key={e.id}
                      className="d-flex justify-content-between align-items-center text-muted"
                    >
                      <span>
                        <strong>{e.date}</strong> - {e.event}
                      </span>
                      <div>
                        <FaEdit
                          style={{
                            cursor: "pointer",
                            marginRight: "12px",
                            color: "#0d6efd",
                          }}
                          onClick={() => handleShowModal(e)}
                          title="Edit Event"
                        />
                        <FaTrash
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => handleDelete(e.id)}
                          title="Delete Event"
                        />
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card>
          </Col>
        </Row>

        {/* Modal for Add/Edit Event */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editEvent ? "Edit Event" : "Add Event"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Event</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter event name"
                  value={formData.event}
                  onChange={(e) =>
                    setFormData({ ...formData, event: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for User Profile */}
        <Modal
          show={showProfile}
          onHide={() => setShowProfile(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>User Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UserProfile />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
