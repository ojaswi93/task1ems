// ems-frontend/src/pages/EmployeeDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import AdminSidebar from "../components/AdminSidebar"; // Import AdminSidebar

function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true); // Set loading to true
        setError(null); // Clear any previous errors
        const token = localStorage.getItem("access");
        if (!token) {
          navigate("/login"); // Redirect if not authenticated
          return;
        }
        const res = await axios.get(`admin/employees/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployee(res.data);
      } catch (error) {
        console.error("Failed to fetch employee details:", error);
        setError(
          "Failed to load employee details. Please check the ID or try again."
        ); // User-friendly error message
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else if (error.response && error.response.status === 404) {
          setError("Employee not found."); // Specific message for 404
        }
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchEmployeeDetails();
  }, [id, navigate]); // Add navigate to dependencies

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="d-flex dashboard-wrapper">
      {" "}
      {/* Apply dashboard-wrapper for layout */}
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-grow-1 main-content p-4">
        {" "}
        {/* Apply main-content and padding */}
        <h3 className="mb-4">
          Employee Profile: {employee?.name || "Loading..."}
        </h3>{" "}
        {/* Dynamic title */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading employee details...</p>
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
            <button
              className="btn btn-link ms-2"
              onClick={() => navigate("/admin/employees")}
            >
              Go back to list
            </button>
          </div>
        )}
        {!loading && !error && employee ? (
          <div className="card shadow-sm p-4">
            {" "}
            {/* Card with shadow and padding */}
            <h5 className="mb-3">Personal Information</h5>
            <div className="row">
              <div className="col-md-6">
                <p className="mb-2">
                  <strong>Name:</strong> {employee.name}{" "}
                  {/* Assuming 'name' field from EmployeeList */}
                </p>
                <p className="mb-2">
                  <strong>Username:</strong> {employee.username}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {employee.email}
                </p>
                <p className="mb-2">
                  <strong>Phone:</strong> {employee.phone}
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-2">
                  <strong>Department:</strong> {employee.department}
                </p>
                <p className="mb-2">
                  <strong>Designation:</strong> {employee.designation}
                </p>
                <p className="mb-2">
                  <strong>Salary:</strong> ₹{employee.salary}
                </p>
                <p className="mb-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${
                      employee.is_active ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {employee.is_active ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>
            {/* Actions for the employee details page (e.g., Edit, View Attendance) */}
            <div className="mt-4 pt-3 border-top d-flex gap-2">
              {" "}
              {/* Separator and spaced buttons */}
              <button
                className="btn btn-primary"
                id="colordd"
                onClick={() => navigate("/admin/employees")}
              >
                <i className="bi bi-arrow-left me-1"></i> Back to Employee List
              </button>
              {/* Add more buttons here if needed, e.g., for editing this employee's details directly */}
              {/* <button className="btn btn-info">Edit Employee</button> */}
            </div>
          </div>
        ) : (
          // This 'else' branch handles cases where employee is null but not loading or error
          // which might happen if `id` is invalid or data is cleared.
          // The `error` state should ideally cover most non-loading null cases.
          <div className="alert alert-warning text-center" role="alert">
            Employee details not available.
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDetails;
