// ems-frontend/src/pages/AdminAttendancePage.js
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar"; // Assuming AdminSidebar is in components

function AdminAttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const token = localStorage.getItem("access");
        if (!token) {
          navigate("/login"); // Redirect if no token
          return;
        }
        const res = await axios.get("admin/attendance/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendanceData(res.data);
      } catch (err) {
        console.error("Failed to fetch all employee attendance", err);
        setError("Failed to load attendance records. Please try again.");
        if (err.response && err.response.status === 401) {
          navigate("/login"); // Redirect on unauthorized
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllAttendance();
  }, [navigate]); // Depend on navigate to avoid stale closures

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="d-flex dashboard-wrapper">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-grow-1 main-content p-4">
        <h3 className="mb-4">All Employee Attendance Records</h3>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading attendance data...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                {attendanceData.length > 0 ? (
                  <table className="table table-bordered table-hover caption-top">
                    <caption>List of all employee attendance</caption>
                    <thead className="table-light">
                      <tr>
                        <th>Employee</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((record) => (
                        <tr key={record.id}>
                          <td>{record.employee_name || record.employee}</td>
                          <td>{record.date}</td>
                          <td>{record.status}</td>
                          <td>{record.remarks || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="alert alert-info text-center" role="alert">
                    No attendance records found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAttendancePage;
