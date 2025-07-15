// ems-frontend/src/components/EmployeeSidebar.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EmployeeSidebar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleGoToDashboard = () => {
    navigate("/employee/dashboard");
  };

  const handleMarkViewAttendance = () => {
    navigate("/employee/attendance");
  };

  return (
    <div
      className={`d-flex flex-column flex-shrink-0 p-3 text-white bg-dark sidebar ${
        isCollapsed ? "collapsed" : ""
      }`}
    >
      <div className="d-flex justify-content-between align-items-center mb-3 mb-md-0 me-md-auto">
        <button
          className={`btn btn-link d-flex align-items-center text-white text-decoration-none p-0 ${
            location.pathname === "/employee/dashboard"
              ? "active-sidebar-link"
              : ""
          }`}
          onClick={handleGoToDashboard}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-speedometer2 me-2 fs-4"></i>
          <span className="fs-5 d-none d-sm-inline">Employee Panel</span>
        </button>
        <button
          className="btn btn-dark sidebar-toggle-button"
          onClick={toggleSidebar}
        >
          <i
            className={`bi ${isCollapsed ? "bi-list" : "bi-x"} text-white`}
          ></i>
        </button>
      </div>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <button
            className={`nav-link text-white sidebar-link ${
              location.pathname === "/employee/attendance"
                ? "active-sidebar-link"
                : ""
            }`}
            onClick={handleMarkViewAttendance}
          >
            <i className="bi bi-calendar-check-fill me-2"></i>
            <span className="d-none d-sm-inline">Mark/View Attendance</span>
          </button>
        </li>
        {/* You can add more employee-specific links here if needed */}
      </ul>
      <hr />
      <div>
        <button className="btn btn-outline-danger w-100" onClick={onLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>
          <span className="d-none d-sm-inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
