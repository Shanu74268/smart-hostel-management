import React, { useState, useEffect, useContext } from "react";
import {
  FaHome,
  FaUser,
  FaBell,
  FaTasks,
  FaFileAlt,
  FaDoorOpen,
  FaMoneyBillWave,
  FaExclamationCircle,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTelegramPlane,
} from "react-icons/fa";
import GatePass from "./GatePass";
import Complaint from "./Complaint";
import HostelFeePayment from "./HostelFeePayment";
import StudentProfile from "./StudentProfile";
import "../../styles/StudentDashboard.css";
import MessMenu from "../common/MessMenu";
import { ProfileContext } from "../common/ProfileContext";

const StudentDashboard = () => {
  const [activePage, setActivePage] = useState("Home");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedPost, setExpandedPost] = useState(false);

  // ✅ Context Data
  const { profilePic, profileData } = useContext(ProfileContext);
  const userProfile =
    profilePic || "https://randomuser.me/api/portraits/men/47.jpg";

  const images = [
    "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1400&q=80",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/login");
  };

  const menuItems = [
    { icon: <FaHome />, label: "Home" },
    { icon: <FaUser />, label: "Profile" },
    { icon: <FaBell />, label: "Notifications" },
    { icon: <FaTasks />, label: "Mess Menu" },
    { icon: <FaFileAlt />, label: "Documents" },
    { icon: <FaDoorOpen />, label: "Gate Pass" },
    { icon: <FaMoneyBillWave />, label: "Fee Submission" },
    { icon: <FaExclamationCircle />, label: "Complaints" },
  ];

  const renderMainContent = () => {
    switch (activePage) {
      case "Home":
      case "Dashboard":
        return (
          <div className="dashboard-home">
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

            <div className="main-section">
              <div className="quick-access-section">
                <div
                  className="quick-card"
                  onClick={() => setActivePage("Fee Submission")}
                >
                  <FaMoneyBillWave className="quick-icon" />
                  <h4>Fee Submission</h4>
                  <p>Pay your hostel or tuition fees easily.</p>
                </div>

                <div
                  className="quick-card"
                  onClick={() => setActivePage("Gate Pass")}
                >
                  <FaDoorOpen className="quick-icon" />
                  <h4>Gate Pass</h4>
                  <p>Request and check your gate pass status.</p>
                </div>

                <div
                  className="quick-card"
                  onClick={() => setActivePage("Complaints")}
                >
                  <FaExclamationCircle className="quick-icon" />
                  <h4>Complaints</h4>
                  <p>Submit and track your complaints.</p>
                </div>

                <div
                  className="quick-card"
                  onClick={() => setActivePage("Mess Menu")}
                >
                  <FaTasks className="quick-icon" />
                  <h4>Mess Menu</h4>
                  <p>Check today’s meals and menu details.</p>
                </div>
              </div>

              <div className="post-section">
                <div className="post-card">
                  <div className="post-header">
                    <img
                      src="https://randomuser.me/api/portraits/men/45.jpg"
                      alt="author"
                      className="post-avatar"
                    />
                    <div>
                      <h4>Admin Office</h4>
                      <p className="post-date">October 6, 2025</p>
                    </div>
                  </div>
                  <div className="post-image">
                    <img
                      src="https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=800&q=80"
                      alt="post"
                    />
                  </div>
                  <div className="post-content">
                    <p className={`post-text ${expandedPost ? "expanded" : ""}`}>
                      🚧 Water supply will be unavailable in Block A from 10 AM -
                      2 PM tomorrow due to maintenance. We apologize for the
                      inconvenience.
                    </p>
                    <span
                      className="read-more"
                      onClick={() => setExpandedPost(!expandedPost)}
                    >
                      {expandedPost ? "Show less" : "Read more"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Profile":
        return <StudentProfile />;

      case "Notifications":
        return <div className="dashboard-card">Notifications Content</div>;

      case "Mess Menu":
        return <MessMenu />;

      case "Documents":
        return <div className="dashboard-card">Documents Content</div>;

      case "Gate Pass":
        return <GatePass />;

      case "Fee Submission":
        return <HostelFeePayment />;

      case "Complaints":
        return <Complaint />;

      default:
        return <div className="dashboard-card">Select a menu item.</div>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* 👤 Profile Section */}
        <div className="sidebar-profile">
          <div className="profile-pic-wrapper">
            <img src={userProfile} alt="profile" className="sidebar-avatar" />
          </div>
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
            Logout
          </li>
        </ul>
      </aside>

      {/* Main Area */}
      <main className="dashboard-container">
        <section className="dashboard-section">{renderMainContent()}</section>
        <footer className="dashboard-footer">
          <p>Designed & Developed by <span>Hostel Portal</span></p>
        </footer>
      </main>

      {/* Floating Social Icons */}
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

export default StudentDashboard;
