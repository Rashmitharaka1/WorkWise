// src/pages/EmployeeForm.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function EmployeeForm(){
  const { id } = useParams(); // id may be 'new' or actual id
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name:"", email:"", phone:"", position:"", role:"employee" });

  useEffect(()=>{ if(id && id !== "new") load(); }, [id]);

  async function load(){
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
    if (!error && data) setForm({
      full_name: data.full_name || "",
      email: data.email || "",
      phone: data.phone || "",
      position: data.position || "",
      role: data.role || "employee"
    });
    setLoading(false);
  }

  async function handleSave(e){
    e.preventDefault();
    setLoading(true);
    if (id === "new") {
      // Insert new profile
      const { error } = await supabase.from("profiles").insert([form]);
      if (error) alert(error.message); else { nav("/employees"); }
    } else {
      const { error } = await supabase.from("profiles").update(form).eq("id", id);
      if (error) alert(error.message); else nav("/employees");
    }
    setLoading(false);
  }

  return (
    <div className="app-shell">
      <div className="card">
        <div className="header">
          <div><div className="logo">{id==="new" ? "Add Employee" : "Edit Employee"}</div><div className="small">Manage profile</div></div>
          <div className="topbar"><Link to="/employees"><button className="btn secondary">Back</button></Link></div>
        </div>

        <form onSubmit={handleSave} className="grid" style={{gridTemplateColumns:"1fr 1fr", gap:12}}>
          <div>
            <label className="label">Full name</label>
            <input className="input" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} required />
          </div>

          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
          </div>

          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
          </div>

          <div>
            <label className="label">Position</label>
            <input className="input" value={form.position} onChange={e=>setForm({...form, position:e.target.value})} />
          </div>

          <div style={{gridColumn:"1 / -1"}}>
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={{gridColumn:"1 / -1"}}>
            <button className="btn" type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
          </div>
        </form>

      </div>
    </div>
  );
}
