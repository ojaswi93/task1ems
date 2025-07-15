// ems-frontend/src/pages/AttendancePage.js
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import EmployeeSidebar from "../components/EmployeeSideBar"; // Import the employee sidebar

function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState({
    date: "",
    status: "Present",
    remarks: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("access");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.get("employee/attendance/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(res.data);
    } catch (err) {
      console.error("Failed to fetch attendance", err);
      setError("Failed to load your attendance records. Please try again.");
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Basic validation: ensure date is selected
      if (!form.date) {
        alert("Please select a date to mark attendance.");
        return;
      }

      const token = localStorage.getItem("access");
      await axios.post("employee/attendance/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Attendance marked successfully!");
      setForm({ date: "", status: "Present", remarks: "" }); // Reset form
      fetchAttendance(); // Refresh attendance list
    } catch (err) {
      console.error("Failed to mark attendance", err);
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.detail === "Attendance already marked for today."
      ) {
        alert("Attendance for this date is already marked.");
      } else if (err.response && err.response.status === 401) {
        navigate("/login");
      } else {
        alert(
          "Failed to mark attendance. Please check your input or try again."
        );
      }
    }
  };

  useEffect(() => {
    fetchAttendance();
    // Pre-fill date with today's date for convenience
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const dd = String(today.getDate()).padStart(2, "0");
    setForm((prevForm) => ({ ...prevForm, date: `${yyyy}-${mm}-${dd}` }));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="d-flex dashboard-wrapper">
      <EmployeeSidebar onLogout={handleLogout} />
      <div className="flex-grow-1 main-content p-4">
        <h3 className="mb-4">Mark & View Your Attendance</h3>

        <div className="card shadow-sm p-4 mb-4">
          <h5 className="mb-3">Mark Today's Attendance</h5>
          <form onSubmit={handleSubmit}>
            {" "}
            {/* Use a form element */}
            <div className="row g-3 align-items-end">
              {" "}
              {/* Align items to the bottom */}
              <div className="col-md-3">
                <label htmlFor="attendanceDate" className="form-label">
                  Date
                </label>
                <input
                  id="attendanceDate"
                  type="date"
                  className="form-control"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required // Make date selection required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="attendanceStatus" className="form-label">
                  Status
                </label>
                <select
                  id="attendanceStatus"
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>{" "}
                  {/* Added a 'Leave' option */}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="attendanceRemarks" className="form-label">
                  Remarks (optional)
                </label>
                <input
                  id="attendanceRemarks"
                  className="form-control"
                  placeholder="e.g., Working from home"
                  value={form.remarks}
                  onChange={(e) =>
                    setForm({ ...form, remarks: e.target.value })
                  }
                />
              </div>
              <div className="col-md-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  id="colordd"
                >
                  {" "}
                  {/* Changed to type="submit" */}
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>

        <h5 className="mb-3">Your Attendance Records</h5>

        {loading && (
          <div className="text-center py-3">
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your records...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="table-responsive card shadow-sm p-3">
            {" "}
            {/* Added card styling to table */}
            {attendance.length > 0 ? (
              <table className="table table-striped table-hover table-bordered caption-top">
                {" "}
                {/* Added table-hover and table-bordered */}
                <caption>Your recent attendance entries</caption>
                <thead className="table-light">
                  {" "}
                  {/* Added table-light for heading */}
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.date}</td>
                      <td>
                        <span
                          className={`badge ${
                            entry.status === "Present"
                              ? "bg-success"
                              : entry.status === "Absent"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>{" "}
                      {/* Styled status with badges */}
                      <td>{entry.remarks || "N/A"}</td>{" "}
                      {/* Display 'N/A' for empty remarks */}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="alert alert-info text-center" role="alert">
                No attendance records found. Mark your first attendance!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;
