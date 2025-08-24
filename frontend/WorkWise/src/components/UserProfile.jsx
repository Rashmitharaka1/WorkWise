// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  Form,
  Container,
  Row,
  Col,
  Card,
  Image,
} from "react-bootstrap";
import { PencilSquare, ArrowLeft } from "react-bootstrap-icons";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Profile not found");

      const profileData = { ...data, email: user.email };
      setProfile(profileData);
      setOriginalProfile(profileData);
    } catch (err) {
      console.error("Error loading profile:", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(e) {
    e.preventDefault();
    if (!profile || !profile.id) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          profile_photo: profile.profile_photo,
        })
        .eq("id", profile.id);

      if (error) throw error;

      alert("Profile updated permanently!");
      setOriginalProfile(profile);   // refresh baseline
      setEditing(false);             // hide buttons
      setPhotoChanged(false);
    } catch (err) {
      console.error("Update failed:", err.message);
      alert("Update failed: " + err.message);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      alert("Error updating password: " + error.message);
    } else {
      alert("Password updated successfully!");
      setShowPasswordFields(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file || !profile?.id) return;

    const filePath = `profile-photos/${profile.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setProfile({ ...profile, profile_photo: data.publicUrl });
    setPhotoChanged(true);
    setEditing(true);
  }

  function cancelChanges() {
    setProfile(originalProfile);
    setEditing(false);
    setPhotoChanged(false);
  }

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <Container className="mt-4 p-4 d-flex justify-content-center ">
      <Card
        className="shadow-lg p-4"
        style={{ maxWidth: "450px", width: "100%", borderRadius: "15px" }}
      >
        {/* Back arrow */}
        <div
          style={{ cursor: "pointer", marginBottom: "10px" }}
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={22} color="#007bff" />
        </div>

        {/* Profile photo + details */}
        <Row className="text-center mb-2">
          <Col>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Image
                src={profile?.profile_photo || "https://via.placeholder.com/150"}
                roundedCircle
                width={90}
                height={90}
              />
              <Form.Control
                type="file"
                onChange={handlePhotoUpload}
                disabled={!editing}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  opacity: 0,
                  width: "100px",
                  height: "100px",
                  cursor: editing ? "pointer" : "not-allowed",
                }}
              />
              <PencilSquare
                style={{
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
                  fontSize: "20px",
                  color: "#007bff",
                  background: "#fff",
                  borderRadius: "50%",
                  padding: "2px",
                  cursor: "pointer",
                }}
                onClick={() => setEditing(true)}
              />
            </div>
            <h4 className="mt-2 text-muted">Hi, {profile?.full_name}!</h4>
            <p className="mb-1 text-muted">{profile?.employee_id}</p>
            <p className="mb-3 text-muted">{profile?.department}</p>
          </Col>
        </Row>

        {/* Profile form */}
        <Row>
          <Col>
            <Form onSubmit={updateProfile}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={profile?.full_name || ""}
                  onChange={(e) => {
                    setProfile({ ...profile, full_name: e.target.value });
                    setEditing(true); // show save/cancel when name changes
                  }}
                  style={{ maxWidth: "300px" }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  style={{
                    maxWidth: "300px",
                    color: "#000",
                    backgroundColor: "#fff",
                  }}
                />
              </Form.Group>

              {/* Change password */}
              {!showPasswordFields && (
                <button
                  type="button"
                  className="btn btn-info text-white mb-2"
                  style={{ width: "150px", fontSize: "0.9rem" }}
                  onClick={() => setShowPasswordFields(true)}
                >
                  Change Password
                </button>
              )}

              {showPasswordFields && (
                <div className="mt-3">
                  <Form.Group className="mb-2">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      style={{ maxWidth: "300px" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      style={{ maxWidth: "300px" }}
                    />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-info text-white"
                      style={{ width: "150px", fontSize: "0.9rem" }}
                      onClick={handlePasswordChange}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="btn btn-info text-white"
                      style={{ width: "150px", fontSize: "0.9rem" }}
                      onClick={() => {
                        setShowPasswordFields(false);
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Save / Cancel */}
              {(editing || photoChanged) && (
                <div className="mt-3 d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-info text-white"
                    style={{ width: "150px", fontSize: "0.9rem" }}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-info text-white"
                    style={{ width: "150px", fontSize: "0.9rem" }}
                    onClick={cancelChanges}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </Form>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
