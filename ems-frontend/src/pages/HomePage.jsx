import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="card-body text-center">
          <h3 className="card-title mb-4">
            Welcome to <span className="text-primary">EMS</span>
          </h3>
          <p className="text-muted mb-4">
            Manage your employee data, attendance, and dashboards efficiently.
          </p>
          <div className="d-grid gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
