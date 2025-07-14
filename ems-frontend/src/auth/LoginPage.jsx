import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("login/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.detail || "Unknown error"));
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
          <h4 className="text-center mb-4">Login</h4>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={handleLogin}>
            Login
          </button>

          <div className="text-center mt-3">
            <small>
              Don't have an account?{" "}
              <span
                className="text-primary"
                role="button"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
