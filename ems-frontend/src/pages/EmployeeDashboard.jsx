import React from "react";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="card p-4">
        <h2 className="mb-4">Employee Dashboard</h2>
        <div className="d-grid gap-3 col-md-6 mx-auto">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/employee/attendance")}
          >
            Mark/View Attendance
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
