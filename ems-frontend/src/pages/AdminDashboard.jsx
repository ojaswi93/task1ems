import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [showAttendance, setShowAttendance] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("dashboard-stats/").then((res) => {
      setStats(res.data);
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleViewAttendance = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get("admin/attendance/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceData(res.data);
      setShowAttendance(true);
    } catch (err) {
      console.error("Failed to fetch attendance", err);
    }
  };

  return (
    <div className="container py-4">
      <h4 className="mb-4">Admin Dashboard</h4>

      {stats ? (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <p className="text-muted mb-1">Total Employees</p>
                  <h5>{stats.total_employees}</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <p className="text-muted mb-1">Active Employees</p>
                  <h5>{stats.active_employees}</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <p className="text-muted mb-1">Inactive Employees</p>
                  <h5>{stats.inactive_employees}</h5>
                </div>
              </div>
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
                    <Bar dataKey="count" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 mb-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/admin/employees")}
            >
              Manage Employees
            </button>
            <button
              className="btn btn-info btn-sm"
              onClick={handleViewAttendance}
            >
              View All Attendance
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {showAttendance && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">All Employee Attendance</h5>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Employee</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((record) => (
                        <tr key={record.id}>
                          <td>{record.employee_name || record.employee}</td>
                          <td>{record.date}</td>
                          <td>{record.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-muted">Loading...</div>
      )}
    </div>
  );
}

export default AdminDashboard;
