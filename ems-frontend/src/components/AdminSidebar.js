// ems-frontend/src/components/AdminSidebar.js (This is already mostly correct based on your "new navbar" code)
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminSidebar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleManageEmployees = () => {
    navigate("/admin/employees");
  };

  const handleViewAttendance = () => {
    navigate("/admin/attendance"); // This is the key navigation for the new page
  };

  const handleGoToDashboard = () => {
    navigate("/admin/dashboard");
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
            location.pathname === "/admin/dashboard"
              ? "active-sidebar-link"
              : ""
          }`}
          onClick={handleGoToDashboard}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-speedometer2 me-2 fs-4"></i>
          <span className="fs-5 d-none d-sm-inline">Admin Panel</span>
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
              location.pathname === "/admin/employees"
                ? "active-sidebar-link"
                : ""
            }`}
            onClick={handleManageEmployees}
          >
            <i className="bi bi-person-lines-fill me-2"></i>
            <span className="d-none d-sm-inline">Manage Employees</span>
          </button>
        </li>
        <li>
          <button
            className={`nav-link text-white sidebar-link ${
              location.pathname === "/admin/attendance" // This is the link for the new page
                ? "active-sidebar-link"
                : ""
            }`}
            onClick={handleViewAttendance}
          >
            <i className="bi bi-calendar-check-fill me-2"></i>
            <span className="d-none d-sm-inline">View Attendance</span>
          </button>
        </li>
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

export default AdminSidebar;
