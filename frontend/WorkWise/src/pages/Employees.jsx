// src/pages/Employees.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function Employees(){
  const [emps, setEmps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchList(); }, []);

  async function fetchList(){
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", {ascending:false});
    if (!error) setEmps(data || []);
    setLoading(false);
  }

  async function handleDelete(id){
    if (!confirm("Delete this employee?")) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchList();
  }

  return (
    <div className="app-shell">
      <div className="card">
        <div className="header">
          <div><div className="logo">WorkWise</div><div className="small">Employee management</div></div>
          <div className="topbar">
            <Link to="/dashboard"><button className="btn secondary">Back</button></Link>
            <Link to="/employees/new"><button className="btn">Add Employee</button></Link>
          </div>
        </div>

        {loading ? <p className="small">Loading...</p> : (
          <div style={{overflowX:"auto"}}>
            <table className="table" role="table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Position</th><th>Role</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {emps.map(e => (
                  <tr key={e.id}>
                    <td>{e.full_name}</td>
                    <td className="small">{e.email}</td>
                    <td>{e.position || "-"}</td>
                    <td><span className="badge">{e.role || "employee"}</span></td>
                    <td className="row-actions">
                      <Link to={`/employees/${e.id}`}><button className="btn secondary">Edit</button></Link>
                      <button className="btn" onClick={() => handleDelete(e.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
