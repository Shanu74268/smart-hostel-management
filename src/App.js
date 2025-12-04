import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Register from "./pages/auth/RegisterStudent";
import Login from "./pages/auth/Login";
import VerifyEmail from "./pages/auth/VerifyEmail";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Warden Pages
import WardenDashboard from "./pages/warden/WardenDashboard";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import GatePass from "./pages/student/GatePass";
import StudentProfile from "./pages/student/StudentProfile";

// Common
import ProtectedRoute from "./pages/common/ProtectRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Warden Routes */}
        <Route path="/warden/dashboard" element={<WardenDashboard />} />

        {/* 🧩 Student Routes (Protected) */}
        <Route element={<ProtectedRoute role="STUDENT" />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/gate-pass" element={<GatePass />} />
          <Route path="/student/complete-profile" element={<StudentProfile />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
