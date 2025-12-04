import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { loginUser, verifyEmail } from "../../api/authApi";
import axios from "axios";
import "../../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const token = searchParams.get("verifyToken");
    const checkEmail = searchParams.get("checkEmail");

    if (checkEmail) {
      setMessage("📧 Please check your email to verify your account.");
      setIsError(false);
      setShowForm(false);
    }

    if (token) {
      setMessage("⏳ Verifying your email...");
      setIsError(false);
      setShowForm(false);
      verifyEmail(token)
        .then(() => {
          setMessage("✅ Email verified successfully! You can now log in.");
          setIsError(false);
          setShowForm(true);
          navigate("/login", { replace: true });
        })
        .catch(() => {
          setMessage("❌ Verification failed. Please check your link.");
          setIsError(true);
          setShowForm(false);
        });
    }
  }, [searchParams, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await loginUser(formData);
      console.log("🔍 Full login response:", res.data);

      let { token, role } = res.data;
      console.log("🧭 Extracted role from backend:", role);

      // ✅ Normalize role (remove 'ROLE_' prefix if present)
      if (role && role.startsWith("ROLE_")) {
        role = role.replace("ROLE_", "");
      }

      if (!token || !role) {
        setMessage("❌ Invalid response from server.");
        setIsError(true);
        setLoading(false);
        return;
      }

      // Store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setMessage("✅ Login successful! Redirecting...");
      setIsError(false);

      // 🧭 Role-based navigation
      if (role === "ADMIN") {
        console.log("➡ Redirecting to /admin/dashboard");
        navigate("/admin/dashboard");
        return;
      }

      if (role === "WARDEN") {
        console.log("➡ Redirecting to /warden/dashboard");
        navigate("/warden/dashboard");
        return;
      }

      if (role === "STUDENT") {
        // 🧩 Student: check profile completion status
        try {
          console.log("🔍 Checking student profile completion...");
          const statusRes = await axios.get(
            "http://localhost:8080/student/profile/status",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const isProfileComplete = statusRes.data;
          console.log("📄 Profile completion:", isProfileComplete);

          if (!isProfileComplete) {
            navigate("/student/complete-profile");
          } else {
            navigate("/student/dashboard");
          }
        } catch (profileErr) {
          console.error("❌ Error checking profile status:", profileErr);
          navigate("/student/dashboard");
        }
        return;
      }

      // 🧯 Fallback if unknown role
      console.warn("⚠ Unknown role:", role);
      setMessage("⚠ Unknown role. Please contact admin.");
      setIsError(true);
    } catch (err) {
      console.error("❌ Login error:", err);
      setMessage(
        err.response?.data?.message || "❌ Login failed. Please try again."
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-form fade-in" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        {message && (
          <p className={`login-message ${isError ? "error" : "success"}`}>
            {message}
          </p>
        )}

        {showForm && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="register-link">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
