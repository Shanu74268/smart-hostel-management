import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { checkProfileStatus } from "../../api/authApi";

const ProtectedRoute = ({ role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [profileComplete, setProfileComplete] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const localProfileStatus = localStorage.getItem("isProfileComplete");

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    const verifyAccess = async () => {
      try {
        if (role === "STUDENT") {
          // ✅ Instant check from localStorage (avoids blank)
          if (localProfileStatus === "true") {
            setProfileComplete(true);
          } else {
            const status = await checkProfileStatus();
            setProfileComplete(status);
            localStorage.setItem("isProfileComplete", status ? "true" : "false");
          }
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Profile check failed:", error);
        setIsAuthenticated(false);
      }
    };

    verifyAccess();
  }, [role]);

  // 🌀 Show loader instead of blank screen
  if (isAuthenticated === null) {
    return (
      <div style={{ textAlign: "center", marginTop: "20vh", fontSize: "1.2rem" }}>
        Loading your dashboard...
      </div>
    );
  }

  // 🚫 Not logged in
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 👨‍🎓 Student profile incomplete → redirect
  if (
    role === "STUDENT" &&
    !profileComplete &&
    location.pathname !== "/student/complete-profile"
  ) {
    return <Navigate to="/student/complete-profile" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
