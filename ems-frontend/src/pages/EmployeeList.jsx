import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

// Make sure you have a CSS file linked, e.g., 'App.css' or 'index.css'
// where you will add the custom styles in Step 2.

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
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get("admin/employees/", {
        params: { search },
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search]);

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("access");
      await axios.post("admin/employees/", newEmp, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      fetchEmployees();
      alert("Employee added successfully");
    } catch (err) {
      console.error("Failed to add employee:", err);
      alert("Failed to add employee");
    }
  };

  const handleEdit = (emp) => {
    setNewEmp({ ...emp });
    setShowAddForm(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access");
      await axios.put(`admin/employees/${newEmp.id}/`, newEmp, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      fetchEmployees();
      alert("Employee updated successfully");
    } catch (err) {
      console.error("Failed to update employee:", err);
      alert("Failed to update employee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this employee?"))
      return;
    try {
      const token = localStorage.getItem("access");
      await axios.delete(`admin/employees/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
      alert("Employee deactivated successfully");
    } catch (err) {
      console.error("Failed to deactivate employee:", err);
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="d-flex dashboard-wrapper">
      <AdminSidebar onLogout={handleLogout} />
      <div className={`flex-grow-1 main-content`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Employee Management</h2>
        </div>

        <input
          className="form-control mb-3"
          placeholder="Search by name/email/phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-custom-grey mb-3" // Stays btn-custom-grey
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
        >
          {showAddForm ? "Cancel" : "Add Employee"}
        </button>

        {showAddForm && (
          <div className="card p-4 mb-4 shadow-sm">
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
                <button className="btn btn-info" onClick={handleUpdate}>
                  Update
                </button>
              ) : (
                <button className="btn btn-custom-grey" onClick={handleAdd}>
                  {" "}
                  {/* Stays btn-custom-grey */}
                  Submit
                </button>
              )}
              <button className="btn btn-secondary ms-2" onClick={resetForm}>
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="table-responsive">
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
              {employees.length > 0 ? (
                employees.map((emp) => (
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
                          className="btn btn-sm btn-custom-grey" // Stays btn-custom-grey
                          onClick={() => handleEdit(emp)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-secondary ms-1"
                          onClick={() => handleDelete(emp.id)}
                        >
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-3">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
