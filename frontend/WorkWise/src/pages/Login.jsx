import React, { useState } from "react";
import { supabase } from "../supabaseClient"; 
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg.jpg";
import { Link } from "react-router-dom";
import Logo from "../assets/logo1.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setShowToast(true);
    } else {
      console.log("Logged in:", data.user);
      navigate("/dashboard"); // redirect after login
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 position-relative"
      style={{
        backgroundImage: `linear-gradient(rgba(38, 38, 39, 0.3), rgba(38, 38, 39, 0.3)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Logo absolutely positioned top-left */}
      <img 
        src={Logo} 
        alt="Logo" 
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '150px',
          height: 'auto',
          zIndex: 10,
        }}
      />

      {/* Login form container */}
      <div 
        className="p-4 py-4 rounded shadow-lg bg-white bg-opacity-80"
        style={{ width: "360px", height: "390px", borderRadius: '10px', zIndex: 20 }}
      >
        <div className="text-center mb-3">
          <h4 className="mt-2"><i>Employee Management System</i></h4>
        </div>

        <form onSubmit={handleLogin} autoComplete="off">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="new-email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
        
          <button
            type="submit"
            className="btn btn-info text-white w-100 mb-2"
          >
            Login
          </button>
        </form>

        <p className="text-center text-muted small mb-0">
          <Link to="/forgot-password" className="text-decoration-none">
            Forgot password?
          </Link>
        </p>
      </div>

      {/* Toast Container */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div className={`toast ${showToast ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">Login Error</strong>
            <button type="button" className="btn-close" onClick={() => setShowToast(false)} aria-label="Close"></button>
          </div>
          <div className="toast-body">
            {errorMessage}
          </div>
        </div>
      </div>
    </div>
  );
}
