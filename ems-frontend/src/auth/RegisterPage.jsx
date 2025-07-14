import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("register/", form);
      setSuccess(res.data.message || "Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.non_field_errors) {
        setError(err.response.data.non_field_errors.join(" "));
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-body">
          <h4 className="text-center mb-4">Register</h4>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              placeholder="Email (provided to admin)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              placeholder="Choose a username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Confirm your password"
              value={form.confirm_password} // <--- Link to new state field
              onChange={(e) =>
                setForm({ ...form, confirm_password: e.target.value })
              } // <--- Update state
            />
          </div>
          {error && <div className="alert alert-danger py-1">{error}</div>}
          {success && <div className="alert alert-success py-1">{success}</div>}

          <button className="btn btn-success w-100" onClick={handleRegister}>
            Register
          </button>

          <div className="text-center mt-3">
            <small>
              Already have an account?{" "}
              <span
                className="text-primary"
                role="button"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
