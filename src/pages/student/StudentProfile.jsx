import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/StudentProfile.css";
import axios from "axios";
import { ProfileContext } from "../common/ProfileContext";

const api = axios.create({
  baseURL: "http://localhost:8080/student/profile",
});

const S3_BASE_URL = "https://your-bucket-name.s3.amazonaws.com/";

const StudentProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { profilePic, setProfilePic } = useContext(ProfileContext);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    motherName: "",
    rollNumber: "",
    branch: "",
    contact: "",
    address: "",
    gender: "",
    dob: "",
    scholarType: "",
    city: "",
    state: "",
    email: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const statusRes = await api.get("/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (statusRes.data === true) {
          setIsProfileComplete(true);

          const profileRes = await api.get("", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = profileRes.data;
          setProfileData(data);
          setFormData({ ...formData, ...data });

          const imageUrl = data.profilePicUrl
            ? data.profilePicUrl.startsWith("http")
              ? data.profilePicUrl
              : S3_BASE_URL + data.profilePicUrl
            : null;

          setPreviewImage(imageUrl);
          setProfilePic(imageUrl);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setMessage("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const uploadImage = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    const res = await api.post("/upload-pic", formDataUpload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.url.startsWith("http")
      ? res.data.url
      : S3_BASE_URL + res.data.url;
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      let profilePicUrl = profileData?.profilePicUrl || null;

      if (selectedFile) {
        profilePicUrl = await uploadImage(selectedFile);
      }

      const payload = { ...formData, profilePicUrl };

      await api.post("/complete", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileData(payload);
      setIsProfileComplete(true);
      setPreviewImage(profilePicUrl);
      setProfilePic(profilePicUrl);
      setSelectedFile(null);
      setMessage("✅ Profile completed successfully!");

      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to complete profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProfilePic = async () => {
    if (!selectedFile) {
      setMessage("Please select a file first!");
      return;
    }
    setSubmitting(true);
    setMessage("");

    try {
      const uploadedUrl = await uploadImage(selectedFile);
      await api.post(
        "/update-profile-pic",
        { profilePicUrl: uploadedUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfileData((prev) => ({ ...prev, profilePicUrl: uploadedUrl }));
      setPreviewImage(uploadedUrl);
      setProfilePic(uploadedUrl);
      setSelectedFile(null);
      setMessage("✅ Profile picture updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile picture.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="profile-loader">Loading profile...</div>;

  return (
    <div className="profile-wrapper fade-in">
      {!isProfileComplete ? (
        <>
          <h2 className="profile-title">Complete Your Profile</h2>
          {message && <p className="profile-message">{message}</p>}

          <form className="profile-form" onSubmit={handleSubmitProfile}>
            <div className="profile-left">
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
              <label htmlFor="profilePic" className="friendly-upload">
                <img
                  src={previewImage || "/default-profile.png"}
                  alt="Preview"
                  className="friendly-preview-img"
                />
              </label>
            </div>

            <div className="form-grid">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="fatherName"
                placeholder="Father's Name"
                value={formData.fatherName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="motherName"
                placeholder="Mother's Name"
                value={formData.motherName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="rollNumber"
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={formData.branch}
                onChange={handleChange}
                required
              /> 
              <input
                type="text"
                name="contact"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
              <select
                name="scholarType"
                value={formData.scholarType}
                onChange={handleChange}
                required
              >
                <option value="">Select Scholar Type</option>
                <option value="Day Scholar">Day Scholar</option>
                <option value="Hostler">Hostler</option>
              </select>
            </div>

            <button type="submit" className="profile-btn">
              {submitting ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className="profile-title">🎓 Student Profile</h2>
          {message && <p className="profile-message">{message}</p>}

          <div className="profile-card">
            <div className="profile-left">
              <img
                src={previewImage || "/default-profile.png"}
                alt="Profile"
                className="profile-pic-square"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="profilePicInput"
                hidden
              />
              <button
                type="button"
                onClick={handleUpdateProfilePic}
                disabled={!selectedFile || submitting}
                className="profile-btn"
                style={{ marginTop: "15px" }}
              >
                {submitting ? "Updating..." : "Change Profile Picture"}
              </button>
            </div>

            <div className="profile-right">
              <p><strong>Full Name:</strong> {profileData.fullName}</p>
              <p><strong>Father’s Name:</strong> {profileData.fatherName}</p>
              <p><strong>Mother’s Name:</strong> {profileData.motherName}</p>
              <p><strong>Roll Number:</strong> {profileData.rollNumber}</p>
              <p><strong>Branch:</strong> {profileData.branch}</p>
              <p><strong>Contact:</strong> {profileData.contact}</p>
              <p><strong>Address:</strong> {profileData.address}</p>
              <p><strong>City:</strong> {profileData.city}</p>
              <p><strong>State:</strong> {profileData.state}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
              <p><strong>Gender:</strong> {profileData.gender}</p>
              <p><strong>Date of Birth:</strong> {profileData.dob}</p>
              <p><strong>Scholar Type:</strong> {profileData.scholarType}</p>
            </div>
          </div>
        </>
      )}

      {submitting && (
        <div className="submission-loader">
          <div className="spinner"></div>
          <p>Saving your profile...</p>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
