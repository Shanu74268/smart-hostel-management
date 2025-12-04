import axios from "axios";

const BASE_URL = "https://smarthostel.eu-north-1.elasticbeanstalk.com";

// 🔹 Common Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Automatically attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ==============================
// 🔸 AUTH APIs
// ==============================

// Self-register user (Student)
export const registerUser = (userData) => api.post("/auth/register", userData);

// Login user
export const loginUser = (userData) => api.post("/auth/login", userData);

// Verify email
export const verifyEmail = (token) =>
  api.get(`/auth/verify-account?token=${token}`, { responseType: "text" });

// Resend verification link
export const resendVerificationLink = (email) =>
  api.get(`/auth/resend-verification?email=${email}`);

// Admin creates student directly (no verification email)
export const createStudentByAdmin = (studentData) =>
  api.post("/auth/admin/create-student", studentData);

// Admin creates warden directly
export const createWardenByAdmin = (wardenData) =>
  api.post("/admin/manage-users/create-warden", wardenData);


// ==============================
// 🔸 STUDENT PROFILE APIs
// ==============================

// Check if student profile is complete
export const checkProfileStatus = async () => {
  try {
    const res = await api.get("/student/profile/status");
    return res.data;
  } catch (error) {
    console.error("Error checking profile status:", error);
    throw error;
  }
};

// Complete student profile
export const completeStudentProfile = async (data) => {
  try {
    const res = await api.put("/student/profile/complete", data);
    return res.data;
  } catch (error) {
    console.error("Error completing profile:", error);
    throw error;
  }
};

// ==============================
// 🔸 ADMIN — MANAGE USERS APIs
// ==============================

// Fetch all users
export const getAllUsers = () => api.get("/admin/manage-users/all");

// Soft Delete user
export const deleteUser = (id) => api.delete(`/admin/manage-users/delete/${id}`);

// Restore user
export const undeleteUser = (id) => api.put(`/admin/manage-users/restore/${id}`);

// Block user
export const blockUser = (id) => api.put(`/admin/manage-users/block/${id}`);

// Unblock user
export const unblockUser = (id) => api.put(`/admin/manage-users/unblock/${id}`);

// ==============================
// 🔸 ADMIN — WARDEN APIs
// ==============================

// Fetch all wardens
export const getAllWardens = () => api.get("/admin/manage-users/wardens");


// Delete warden
export const deleteWarden = (id) => api.delete(`/admin/manage-users/delete/${id}`);

// ==============================
// 🔸 Export Default API
// ==============================
export default api;
