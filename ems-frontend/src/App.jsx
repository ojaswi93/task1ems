// ems-frontend/src/App.js (This should already be fine, just confirming structure)
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard"; // Now includes sidebar
import AttendancePage from "./pages/AttendancePage"; // Now includes sidebar
import EmployeeList from "./pages/EmployeeList";
import EmployeeDetails from "./pages/EmployeeDetails";
import HomePage from "./pages/HomePage";
import AdminAttendancePage from "./pages/AdminAttendancePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<EmployeeList />} />
        <Route path="/admin/employees/:id" element={<EmployeeDetails />} />
        <Route path="/admin/attendance" element={<AdminAttendancePage />} />

        {/* Employee Routes (These now render pages that contain their own sidebars) */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/attendance" element={<AttendancePage />} />
      </Routes>
    </Router>
  );
}

export default App;
