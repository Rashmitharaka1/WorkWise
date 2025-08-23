// src/components/ProfileIcon.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ProfileIcon() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return;

        // Get avatar URL from profiles table
        const { data, error } = await supabase
          .from("profiles")
          .select("profile_photo")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        // Set avatar URL if exists
        setAvatarUrl(data?.profile_photo || null);
      } catch (err) {
        console.error("Error fetching avatar:", err.message);
      }
    };

    fetchAvatar();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchAvatar();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "40px",
        cursor: "pointer",
        zIndex: 1000,
      }}
      onClick={() => navigate("/profile")}
      title="Go to Profile"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Profile"
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #ebeff5ff",
          }}
        />
      ) : (
        // fallback circle if no avatar
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#0d6efd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "20px",
          }}
        >
          U
        </div>
      )}
    </div>
  );
}
