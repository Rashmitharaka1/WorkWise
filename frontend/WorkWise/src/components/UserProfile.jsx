import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    const user = supabase.auth.getUser();
    const { data: { user: currentUser } } = await user;

    if (!currentUser) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    if (error) console.log("Error fetching profile:", error);
    else {
      setProfile(data);
      setFullName(data.full_name);
    }

    setLoading(false);
  }

  async function updateProfile() {
    const user = supabase.auth.getUser();
    const { data: { user: currentUser } } = await user;
    if (!currentUser) return;

    let avatar_url = profile.avatar_url;

    // Upload avatar if selected
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${currentUser.id}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, { upsert: true });

      if (error) {
        console.log("Upload error:", error);
        return;
      }
      avatar_url = supabase.storage.from("avatars").getPublicUrl(fileName).data.publicUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, avatar_url })
      .eq("id", currentUser.id);

    if (error) setMessage("Error updating profile");
    else setMessage("Profile updated!");
  }

  async function changePassword(oldPassword, newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMessage("Password update failed");
    else setMessage("Password updated!");
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {/* Profile Picture */}
      <div>
        <img
          src={profile.avatar_url || "/default-avatar.png"}
          alt="Profile"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
        <input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} />
      </div>

      {/* Full Name */}
      <div>
        <label>Full Name:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      {/* Email (read-only) */}
      <div>
        <label>Email:</label>
        <input type="text" value={profile.email || ""} disabled />
      </div>

      {/* Password change */}
      <div>
        <label>New Password:</label>
        <input type="password" id="newPassword" />
        <button
          onClick={() =>
            changePassword(null, document.getElementById("newPassword").value)
          }
        >
          Change Password
        </button>
      </div>

      <button onClick={updateProfile}>Save Changes</button>

      {message && <p>{message}</p>}
    </div>
  );
}
