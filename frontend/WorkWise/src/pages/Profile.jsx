// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function Profile(){
  const { profile, loading, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name:"", phone:"", position:"" });
  const [saving, setSaving] = useState(false);

  useEffect(()=> {
    if (profile) setForm({ full_name:profile.full_name || "", phone:profile.phone||"", position:profile.position||"" });
  }, [profile]);

  async function save(e){
    e.preventDefault();
    setSaving(true);
    const updates = { full_name: form.full_name, phone: form.phone, position: form.position };
    const { error } = await supabase.from("profiles").update(updates).eq("id", profile.id);
    if (error) alert(error.message);
    else { await refreshProfile(); alert("Profile updated"); }
    setSaving(false);
  }

  if (loading) return <div className="app-shell"><div className="card center">Loading...</div></div>;

  return (
    <div className="app-shell">
      <div className="card">
        <div className="header">
          <div><div className="logo">WorkWise</div><div className="small">Your profile</div></div>
          <div className="topbar"><Link to="/dashboard"><button className="btn secondary">Back</button></Link></div>
        </div>

        <form onSubmit={save} className="grid" style={{gap:12}}>
          <div>
            <label className="label">Full name</label>
            <input className="input" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
          </div>
          <div>
            <label className="label">Position</label>
            <input className="input" value={form.position} onChange={e=>setForm({...form, position:e.target.value})} />
          </div>

          <div><button className="btn" type="submit" disabled={saving}>{saving? "Saving...":"Save Profile"}</button></div>
        </form>
      </div>
    </div>
  );
}
