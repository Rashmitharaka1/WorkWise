// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound(){
  return (
    <div className="app-shell">
      <div className="card center">
        <h2>Page not found</h2>
        <Link to="/dashboard"><button className="btn">Go Home</button></Link>
      </div>
    </div>
  );
}
