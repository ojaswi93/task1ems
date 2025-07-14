import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmp, setNewEmp] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
  });
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    const res = await axios.get("admin/employees/", {
      params: { search },
    });
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, [search]);

  const handleAdd = async () => {
    try {
      await axios.post("admin/employees/", newEmp);
      resetForm();
      fetchEmployees();
      alert("Employee added successfully");
    } catch (err) {
      alert("Failed to add employee");
    }
  };

  const handleEdit = (emp) => {
    setNewEmp({ ...emp });
    setShowAddForm(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`admin/employees/${newEmp.id}/`, newEmp);
      resetForm();
      fetchEmployees();
      alert("Employee updated successfully");
    } catch (err) {
      alert("Failed to update employee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this employee?"))
      return;
    try {
      await axios.delete(`admin/employees/${id}/delete/`);
      fetchEmployees();
    } catch (err) {
      alert("Failed to deactivate employee");
    }
  };

  const resetForm = () => {
    setNewEmp({
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      salary: "",
    });
    setShowAddForm(false);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employee Management</h2>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/admin/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      <input
        className="form-control mb-3"
        placeholder="Search by name/email/phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          resetForm();
          setShowAddForm(!showAddForm);
        }}
      >
        {showAddForm ? "Cancel" : "Add Employee"}
      </button>

      {showAddForm && (
        <div className="card p-4 mb-4">
          <h5>{newEmp.id ? "Edit Employee" : "Add New Employee"}</h5>
          <div className="row g-3 mt-2">
            {[
              "name",
              "email",
              "phone",
              "department",
              "designation",
              "salary",
            ].map((field) => (
              <div className="col-md-4" key={field}>
                <input
                  className="form-control"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={newEmp[field]}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, [field]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
          <div className="mt-3">
            {newEmp.id ? (
              <button className="btn btn-success" onClick={handleUpdate}>
                Update
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleAdd}>
                Submit
              </button>
            )}
          </div>
        </div>
      )}

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/admin/employees/${emp.id}`)}
              >
                {emp.name}
              </td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.department}</td>
              <td>{emp.is_active ? "Active" : "Inactive"}</td>
              <td>
                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(emp)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Deactivate
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
