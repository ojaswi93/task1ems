// ems-frontend/src/pages/EmployeeDashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import EmployeeSidebar from "../components/EmployeeSideBar"; // Import the employee sidebar

function EmployeeDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="d-flex dashboard-wrapper">
      {" "}
      {/* Use dashboard-wrapper for consistent layout */}
      <EmployeeSidebar onLogout={handleLogout} />
      <div className="flex-grow-1 main-content p-4">
        {" "}
        {/* Use main-content and p-4 for consistent styling */}
        <h3 className="mb-4">Employee Dashboard Overview</h3>{" "}
        {/* Consistent heading style */}
        {/* You can add more dashboard content here specific to employees,
            like personal stats, upcoming events, etc. */}
        <div className="alert alert-info" role="alert">
          Welcome to your Employee Dashboard! Use the sidebar for navigation.
        </div>
        {/* Removed direct Mark/View Attendance button as it's now in the sidebar */}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
