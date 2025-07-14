import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState({
    date: "",
    status: "Present",
    remarks: "",
  });

  const fetchAttendance = async () => {
    const res = await axios.get("employee/attendance/");
    setAttendance(res.data);
  };

  const handleSubmit = async () => {
    try {
      await axios.post("employee/attendance/", form);
      alert("Attendance marked!");
      setForm({ date: "", status: "Present", remarks: "" });
      fetchAttendance();
    } catch (err) {
      alert("Failed to mark attendance. Maybe already marked?");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Attendance</h2>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Mark Today's Attendance</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Remarks (optional)"
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>

      <h5 className="mb-3">Your Attendance Records</h5>
      <table className="table table-striped table-bordered">
        <thead>
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
              <td>{entry.status}</td>
              <td>{entry.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendancePage;
