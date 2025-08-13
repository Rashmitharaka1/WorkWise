import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import ProfileIcon from "../components/ProfileIcon";
import { Row, Col, Card, ListGroup } from "react-bootstrap";

export default function Dashboard() {

  // Example upcoming events
  const events = [
    { date: "2025-08-15", event: "Team Meeting" },
    { date: "2025-08-18", event: "Project Deadline" },
    { date: "2025-08-20", event: "Employee Birthday - Sarah" },
  ];

  return (
    <div className="d-flex" style={{ position: "relative" }}>
      <Sidebar />
      <div
        className="flex-grow-1 p-4"
        style={{ backgroundColor: "#f8f9fa", position: "relative" }}
      >
        {/* Top-right profile icon */}
        <ProfileIcon />

        <h2 className="mb-5">Welcome to WorkWise !</h2>

        {/* Dashboard cards */}
        <DashboardCards />

        {/* Events */}
        <Row className="mt-4">
          <Col md={12}>
            <Card className="shadow-sm p-3">
              <h5>Upcoming Events</h5>
              <ListGroup variant="flush">
                {events.map((e, index) => (
                  <ListGroup.Item key={index}>
                    <strong>{e.date}</strong> - {e.event}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
