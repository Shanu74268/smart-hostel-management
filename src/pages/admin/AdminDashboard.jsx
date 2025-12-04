import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaChartLine,
  FaCog,
  FaFileAlt,
  FaBell,
  FaClipboardList,
  FaSignOutAlt,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTelegramPlane,
} from "react-icons/fa";
import ManageUsers from "./ManageUsers"; // real component
import "../../styles/AdminDashboard.css";

// Temporary placeholder components
const Requests = () => <div className="dashboard-card">Requests Page (Coming Soon)</div>;
const Reports = () => <div className="dashboard-card">Reports Page (Coming Soon)</div>;
const Notifications = () => <div className="dashboard-card">Notifications Page (Coming Soon)</div>;
const Settings = () => <div className="dashboard-card">Settings Page (Coming Soon)</div>;

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("Home");
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=1400&q=80",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  const menuItems = [
    { icon: <FaChartLine />, label: "Home" },
    { icon: <FaUsers />, label: "Manage Users" },
    { icon: <FaClipboardList />, label: "Requests" },
    { icon: <FaFileAlt />, label: "Reports" },
    { icon: <FaBell />, label: "Notifications" },
    { icon: <FaCog />, label: "Settings" },
  ];

  const renderMainContent = () => {
    switch (activePage) {
      case "Home":
        return (
          <div className="dashboard-home">
            {/* Slider */}
            <div className="slider-container">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`slide ${index === currentSlide ? "active" : ""}`}
                  style={{ backgroundImage: `url(${img})` }}
                ></div>
              ))}
              <div className="slider-dots">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={index === currentSlide ? "dot active-dot" : "dot"}
                    onClick={() => setCurrentSlide(index)}
                  ></span>
                ))}
              </div>
            </div>

            {/* Quick Access Cards */}
            <div className="main-section">
              <div className="quick-access-section">
                <div className="quick-card" onClick={() => setActivePage("Manage Users")}>
                  <FaUsers className="quick-icon" />
                  <h4>Manage Users</h4>
                  <p>View and manage all student and staff accounts.</p>
                </div>
                <div className="quick-card" onClick={() => setActivePage("Requests")}>
                  <FaClipboardList className="quick-icon" />
                  <h4>Requests</h4>
                  <p>Review and approve student gate pass or complaint requests.</p>
                </div>
                <div className="quick-card" onClick={() => setActivePage("Reports")}>
                  <FaFileAlt className="quick-icon" />
                  <h4>Reports</h4>
                  <p>Generate and analyze hostel activity reports.</p>
                </div>
                <div className="quick-card" onClick={() => setActivePage("Settings")}>
                  <FaCog className="quick-icon" />
                  <h4>Settings</h4>
                  <p>Configure system preferences and user roles.</p>
                </div>
              </div>

              {/* Post Section */}
              <div className="post-section">
                <div className="post-card">
                  <div className="post-header">
                    <img
                      src="https://randomuser.me/api/portraits/men/23.jpg"
                      alt="Admin"
                      className="post-avatar"
                    />
                    <div>
                      <h4>System Update</h4>
                      <p className="post-date">November 10, 2025</p>
                    </div>
                  </div>
                  <div className="post-image">
                    <img
                      src="https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=800&q=80"
                      alt="update"
                    />
                  </div>
                  <div className="post-content">
                    <p>
                      🚀 New analytics dashboard launched! Admins can now view detailed reports of hostel requests, gate passes, and student activities in real time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Manage Users":
        return <ManageUsers />;
      case "Requests":
        return <Requests />;
      case "Reports":
        return <Reports />;
      case "Notifications":
        return <Notifications />;
      case "Settings":
        return <Settings />;

      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
            src="https://randomuser.me/api/portraits/men/12.jpg"
            alt="Admin"
            className="sidebar-avatar"
          />
          <h4>Admin Panel</h4>
        </div>

        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => setActivePage(item.label)}
              className={activePage === item.label ? "active" : ""}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </li>
          ))}
          <li
            onClick={handleLogout}
            style={{
              marginTop: "auto",
              backgroundColor: "#e74c3c",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <FaSignOutAlt style={{ marginRight: "8px" }} />
            Logout
          </li>
        </ul>
      </aside>

      {/* Main Area */}
      <main className="dashboard-container">
        <section className="dashboard-section">{renderMainContent()}</section>
        <footer className="dashboard-footer">
          <p>
            © 2025 <span>Hostel Admin Portal</span>
          </p>
        </footer>
      </main>

      {/* Social Icons */}
      <div className="floating-social-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebookF />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <FaYoutube />
        </a>
        <a href="https://t.me/yourchannel" target="_blank" rel="noopener noreferrer">
          <FaTelegramPlane />
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;
