import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    axios.get(`admin/employees/${id}/`).then((res) => {
      setEmployee(res.data);
    });
  }, [id]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Employee Details</h2>
      {employee ? (
        <div className="card p-4">
          <p>
            <strong>Username:</strong> {employee.username}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Phone:</strong> {employee.phone}
          </p>
          <p>
            <strong>Department:</strong> {employee.department}
          </p>
          <p>
            <strong>Designation:</strong> {employee.designation}
          </p>
          <p>
            <strong>Salary:</strong> ₹{employee.salary}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {employee.is_active ? "Active" : "Inactive"}
          </p>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/admin/employees")}
          >
            Back to Employee List
          </button>
        </div>
      ) : (
        <p>Loading employee...</p>
      )}
    </div>
  );
}

export default EmployeeDetails;
