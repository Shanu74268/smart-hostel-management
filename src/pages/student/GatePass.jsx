import React, { useState, useEffect, useCallback, useContext } from "react";
import "../../styles/GatePass.css";
import axios from "axios";
import { ProfileContext } from "../common/ProfileContext";

const API_BASE = "http://localhost:8080";

const GatePass = () => {
  const token = localStorage.getItem("token");

  const { profilePic, profileData } = useContext(ProfileContext);

  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({
    leaveType: "",
    date: "",
    timeFrom: "",
    timeTo: "",
    reason: "",
  });
  const [requests, setRequests] = useState([]);

  const fetchStudentProfile = useCallback(async () => {
    try {
      const statusRes = await axios.get(`${API_BASE}/student/profile/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statusRes.data === true) {
        const profileRes = await axios.get(`${API_BASE}/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudent(profileRes.data);
      } else {
        alert("⚠️ Please complete your profile first!");
      }
    } catch (err) {
      console.error("❌ Error fetching student profile:", err);
      if (err.response?.status === 403) {
        alert("⚠️ Session expired, please login again.");
        window.location.href = "/login";
      }
    }
  }, [token]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/gatepass/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedData = (res.data || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setRequests(sortedData);
    } catch (err) {
      console.error("❌ Error fetching gate pass history:", err);
      if (err.response?.status === 403) {
        alert("⚠️ Forbidden: Please login again.");
      }
    }
  }, [token]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, date: today }));
    fetchStudentProfile();
    fetchRequests();
  }, [fetchStudentProfile, fetchRequests]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const wordCount = formData.reason.trim().split(/\s+/).length;
    if (!formData.leaveType) {
      alert("Please select a leave type");
      return;
    }
    if (wordCount < 10) {
      alert("Reason must be at least 10 words");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/gatepass/apply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("✅ " + res.data);
      await fetchRequests();

      setFormData({
        leaveType: "",
        date: new Date().toISOString().split("T")[0],
        timeFrom: "",
        timeTo: "",
        reason: "",
      });
    } catch (err) {
      console.error("❌ Error applying gate pass:", err);
      if (err.response?.status === 403) {
        alert("⚠️ Forbidden: Invalid or expired token");
      } else {
        alert("❌ Failed to apply gate pass");
      }
    }
  };

  const renderInput = (id, icon, type, label, extraProps = {}) => (
    <div
      className={`input-wrapper ${formData[id] ? "filled" : ""}`}
      onClick={() => {
        const input = document.getElementById(id);
        if (type === "date" || type === "time") input.showPicker?.();
        input.focus();
      }}
    >
      <span className="input-icon">{icon}</span>
      <input
        id={id}
        type={type}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        placeholder=""
        {...extraProps}
      />
      <label>{label}</label>
    </div>
  );

  return (
    <div className="gatepass-wrapper">
      <div className="gatepass-left">
        <div className="gatepass-card">
          <h2 className="dashboard-title">🚪 Gate Pass Request</h2>

          {student ? (
            <div className="student-info horizontal">
              <div className="student-image-wrapper">
                <img
                  src={profilePic || "/default-profile.png"}
                  alt="Profile"
                  className="student-avatar-square"
                />
              </div>
              <div className="student-details-horizontal">
                <div className="student-row">
                  <p>
                    <strong>Name:</strong> {profileData?.fullName || student.fullName}
                  </p>
                  <p>
                    <strong>Father's Name:</strong> {student.fatherName}
                  </p>
                </div>
                <div className="student-row">
                  <p>
                    <strong>Mother's Name:</strong> {student.motherName}
                  </p>
                  <p>
                    <strong>Roll No:</strong> {student.rollNumber}
                  </p>
                </div>
                <div className="student-row">
                  <p>
                    <strong>Branch:</strong> {student.branch}
                  </p>
                  <p>
                    <strong>Semester:</strong> {student.semester}
                  </p>
                </div>
                <div className="student-row">
                  <p>
                    <strong>Contact:</strong> {student.contactNumber}
                  </p>
                  <p>
                    <strong>Email:</strong> {student.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="loading-text">Loading profile...</p>
          )}

          <p className="form-description">
            Fill the details below to apply for a Gate Pass
          </p>

          <form onSubmit={handleSubmit} className="gatepass-form">
            <div className="leave-type-section horizontal-row">
              <p className="leave-type-title">Leave Type:</p>
              <div className="leave-type-wrapper">
                <label
                  className={`pill-radio ${
                    formData.leaveType === "Full Day" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="leaveType"
                    value="Full Day"
                    checked={formData.leaveType === "Full Day"}
                    onChange={handleChange}
                  />
                  Full Day
                </label>
                <label
                  className={`pill-radio ${
                    formData.leaveType === "Partial" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="leaveType"
                    value="Partial"
                    checked={formData.leaveType === "Partial"}
                    onChange={handleChange}
                  />
                  Partial
                </label>
              </div>
            </div>

            {renderInput("date", "📅", "date", "Date", { readOnly: true })}
            {renderInput("timeFrom", "⏰", "time", "Time From")}
            {formData.leaveType === "Partial" &&
              renderInput("timeTo", "⏰", "time", "Time To")}
            {renderInput("reason", "📝", "text", "Reason (min 10 words)")}

            <button type="submit" className="submit-button">
              Submit Request
            </button>
          </form>
        </div>
      </div>

      <div className="gatepass-right">
        <div className="gatepass-card">
          <h2 className="dashboard-title">📜 Gate Pass History</h2>
          {requests.length === 0 ? (
            <p className="no-requests">No requests yet.</p>
          ) : (
            <div className="requests-table-wrapper">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Warden</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.warden || "Not Assigned"}</td>
                      <td>{req.date}</td>
                      <td>
                        {req.timeFrom}
                        {req.leaveType === "Partial" ? ` - ${req.timeTo}` : ""}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${req.status?.toLowerCase()}`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GatePass;
