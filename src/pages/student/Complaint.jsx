import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../../styles/Complaint.css";
import { ProfileContext } from "../common/ProfileContext";

const Complaint = () => {
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({
    complaintType: "",
    date: "",
    description: "",
  });
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // ✅ Use profile context
  const { profilePic, profileData } = useContext(ProfileContext);

  // ✅ Fetch logged-in student's profile (still sets local student for other fields)
  const fetchStudentProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8080/student/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage("Failed to load student profile.");
    }
  };

  // ✅ Fetch logged-in student's complaints
  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:8080/complaint/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      if (error.response && error.response.status === 403) {
        setMessage("Unauthorized access. Please login again.");
      } else {
        setMessage("Failed to fetch complaints. Try again later.");
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchStudentProfile();
      fetchComplaints();
    }
  }, []);

  // ✅ Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.complaintType) {
      alert("Please select a complaint type.");
      return;
    }
    if (formData.description.trim().split(/\s+/).length < 5) {
      alert("Complaint description must be at least 5 words.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/complaint/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ " + (res.data || "Complaint submitted successfully!"));
      setMessage("Complaint submitted successfully!");
      setFormData({ complaintType: "", date: "", description: "" });
      fetchComplaints();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      if (error.response && error.response.status === 403) {
        alert("⚠️ Unauthorized. Please login again.");
        setMessage("Unauthorized. Please login again.");
      } else {
        alert("❌ Failed to submit complaint.");
        setMessage("Failed to submit complaint. Try again later.");
      }
    }
  };

  // ✅ Reusable Input Field
  const renderInput = (id, icon, type, label, extraProps = {}) => (
    <div
      className={`input-wrapper ${formData[id] ? "filled" : ""}`}
      onClick={() => {
        const input = document.getElementById(id);
        if (type === "date") input.showPicker?.();
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
    <div className="complaint-wrapper">
      {/* Left Column */}
      <div className="complaint-left">
        <div className="complaint-card">
          <h2 className="dashboard-title">🧾 Lodge a Complaint</h2>

          {/* Student Info (fetched dynamically) */}
          {student ? (
            <div className="student-info horizontal">
              <div className="student-image-wrapper">
                <img
                  src={
                    profilePic || // use context profilePic
                    student.profilePic ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt="Profile"
                  className="student-avatar-square"
                />
              </div>
              <div className="student-details-horizontal">
                <div className="student-row">
                  <p>
                    <strong>Name:</strong>{" "}
                    {profileData?.fullName || student.fullName}
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
                    <strong>Room No:</strong> {student.roomNumber}
                  </p>
                  <p>
                    <strong>Branch:</strong> {student.branch}
                  </p>
                </div>
                <div className="student-row">
                  <p>
                    <strong>Contact:</strong> {student.contact}
                  </p>
                  <p>
                    <strong>Email:</strong> {student.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="loading-profile">Loading profile...</p>
          )}

          {/* Description */}
          <p className="form-description">
            Fill the details below to register your complaint.
          </p>

          {/* Complaint Form */}
          <form onSubmit={handleSubmit} className="complaint-form">
            <div className="complaint-type-section horizontal-row">
              <p className="complaint-type-title">Complaint Type:</p>
              <div className="complaint-type-wrapper">
                {["Maintenance", "Mess", "Discipline", "Other"].map((type) => (
                  <label
                    key={type}
                    className={`pill-radio ${
                      formData.complaintType === type ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="complaintType"
                      value={type}
                      checked={formData.complaintType === type}
                      onChange={handleChange}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {renderInput("date", "📅", "date", "Date")}
            {renderInput(
              "description",
              "📝",
              "text",
              "Complaint Description (min 5 words)"
            )}

            <button type="submit" className="submit-button">
              Submit Complaint
            </button>
          </form>

          {message && (
            <p
              style={{
                color: message.includes("successfully") ? "green" : "red",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="complaint-right">
        <div className="complaint-card">
          <h2 className="dashboard-title">📋 Complaint History</h2>
          {complaints.length === 0 ? (
            <p className="no-complaints">No complaints yet.</p>
          ) : (
            <div className="complaints-table-wrapper">
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((comp) => (
                    <tr key={comp.id}>
                      <td>{comp.complaintType}</td>
                      <td>{comp.date}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            comp.status ? comp.status.toLowerCase() : "pending"
                          }`}
                        >
                          {comp.status || "Pending"}
                        </span>
                      </td>
                      <td>{comp.description}</td>
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

export default Complaint;
