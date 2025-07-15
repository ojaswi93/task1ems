import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom"; // Keep useLocation
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import AdminSidebar from "../components/AdminSidebar"; // Import the standalone sidebar

// --- EmployeeStatCard Component (No Change) ---
const EmployeeStatCard = ({
  title,
  value,
  iconClass,
  bgColorClass,
  textColorClass,
}) => {
  return (
    <div className={`card mb-3 shadow-sm ${bgColorClass} ${textColorClass}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title mb-0">{title}</h5>
            <p className="card-text fs-3 fw-bold">{value}</p>
          </div>
          <i className={`${iconClass} fa-3x opacity-50`}></i>
        </div>
      </div>
    </div>
  );
};

// --- AdminDashboard Main Component ---
function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]); // State for attendance data
  const navigate = useNavigate();
  const location = useLocation(); // To check current route

  // Effect to fetch Dashboard Stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("dashboard-stats/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    // Only fetch dashboard stats if on the dashboard route
    if (location.pathname === "/admin/dashboard") {
      fetchDashboardStats();
    }
  }, [location.pathname, navigate]); // Rerun if route changes

  // Effect to fetch ALL Employee Attendance (for Admin view)
  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("admin/attendance/", {
          // Admin endpoint for ALL attendance
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendanceData(res.data);
      } catch (err) {
        console.error("Failed to fetch all employee attendance", err);
        if (err.response && err.response.status === 401) {
          navigate("/login");
        }
      }
    };

    // Only fetch all attendance if on the admin attendance route
    if (location.pathname === "/admin/attendance") {
      fetchAllAttendance();
    } else {
      setAttendanceData([]); // Clear attendance data if not on attendance page
    }
  }, [location.pathname, navigate]); // Rerun if route changes

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const renderContent = () => {
    if (location.pathname === "/admin/attendance") {
      return (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">All Employee Attendance Records</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remarks</th>{" "}
                    {/* Assuming remarks exists in admin/attendance/ endpoint */}
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.length > 0 ? (
                    attendanceData.map((record) => (
                      <tr key={record.id}>
                        <td>{record.employee_name || record.employee}</td>{" "}
                        {/* Adjust field name as per your API */}
                        <td>{record.date}</td>
                        <td>{record.status}</td>
                        <td>{record.remarks || "N/A"}</td>{" "}
                        {/* Display remarks if available */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else {
      // Default to dashboard content
      return stats ? (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <EmployeeStatCard
                title="Total Employees"
                value={stats.total_employees}
                iconClass="bi bi-people-fill"
                bgColorClass="bg-light"
                textColorClass="text-dark"
              />
            </div>
            <div className="col-md-4">
              <EmployeeStatCard
                title="Active Employees"
                value={stats.active_employees}
                iconClass="bi bi-person-check-fill"
                bgColorClass="bg-light"
                textColorClass="text-dark"
              />
            </div>
            <div className="col-md-4">
              <EmployeeStatCard
                title="Inactive Employees"
                value={stats.inactive_employees}
                iconClass="bi bi-person-x-fill"
                bgColorClass="bg-light"
                textColorClass="text-dark"
              />
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="card-title mb-3">Employees by Department</h6>
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <BarChart data={stats.employees_by_department}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#428BCA" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-muted py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      );
    }
  };

  return (
    <div className="d-flex dashboard-wrapper">
      <AdminSidebar
        onLogout={handleLogout} // Pass logout handler
      />
      <div className={`flex-grow-1 main-content`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            {location.pathname === "/admin/attendance"
              ? "All Employee Attendance Overview"
              : "Admin Overview"}
          </h2>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
