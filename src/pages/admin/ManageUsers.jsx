import React, { useEffect, useState, useMemo } from "react";
import {
  FaTrash,
  FaUndo,
  FaBan,
  FaPlus,
  FaSearch,
  FaUsers,
  FaUserGraduate,
  FaLock,
  FaTimes,
} from "react-icons/fa";

import "../../styles/ManageUsers.css";

import {
  createStudentByAdmin,
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  undeleteUser,
  createWardenByAdmin,
} from "../../api/authApi";

const ManageUsers = () => {
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [showWardenPopup, setShowWardenPopup] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [wardenData, setWardenData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    age: "",
    city: "",
    contactNumber: "",
    hostelName: "",
    nationality: "",
    state: "",
    zipCode: "",
  });
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("ALL");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm.toLowerCase()), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setAllUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to fetch users. Check your authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      alert("User deleted!");
      fetchAllUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const handleUndelete = async (id) => {
    try {
      await undeleteUser(id);
      alert("User restored!");
      fetchAllUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to restore user.");
    }
  };

  const handleBlockToggle = async (user) => {
    try {
      if (user.blocked) await unblockUser(user.id);
      else await blockUser(user.id);
      fetchAllUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const stats = {
    active: allUsers.filter((u) => !u.blocked && !u.deleted).length,
    blocked: allUsers.filter((u) => u.blocked && !u.deleted).length,
    deleted: allUsers.filter((u) => u.deleted).length,
    total: allUsers.length,
  };

  const handleConfirmStudent = async () => {
    try {
      await createStudentByAdmin(formData);
      alert("Student created successfully!");
      fetchAllUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to create student.");
    } finally {
      setConfirmCreate(false);
      setShowStudentPopup(false);
      setFormData({ fullName: "", email: "", password: "" });
    }
  };

  const handleConfirmWarden = async () => {
    try {
      await createWardenByAdmin(wardenData);
      alert("✅ Warden created successfully!");
      fetchAllUsers();
    } catch (err) {
      console.error(err);
      if (err.response?.data) alert("❌ " + err.response.data);
      else if (err.request) alert("❌ Server not responding. Please try again later.");
      else alert("❌ An unexpected error occurred.");
      return;
    }
    setShowWardenPopup(false);
    setWardenData({
      fullName: "",
      email: "",
      password: "",
      address: "",
      age: "",
      city: "",
      contactNumber: "",
      hostelName: "",
      nationality: "",
      state: "",
      zipCode: "",
    });
  };

  const highlightMatch = (text) => {
    if (!debouncedSearch.trim()) return text;
    const regex = new RegExp(`(${debouncedSearch})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  const filteredUsers = useMemo(() => {
    return allUsers
      .filter((user) => {
        if (selectedTab === "ACTIVE") return !user.blocked && !user.deleted;
        if (selectedTab === "BLOCKED") return user.blocked && !user.deleted;
        if (selectedTab === "DELETED") return user.deleted;
        return true;
      })
      .filter((user) => {
        if (!debouncedSearch) return true;
        const search = debouncedSearch.toLowerCase();
        return (
          user.id.toString().includes(search) ||
          user.fullName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.role.toLowerCase().includes(search) ||
          (user.blocked ? "blocked" : "active").includes(search) ||
          (user.deleted ? "deleted" : "not deleted").includes(search)
        );
      });
  }, [allUsers, debouncedSearch, selectedTab]);

  return (
    <div className="manage-users-page">
      {/* Header */}
      <div className="page-header">
        <h2>👥 Manage Users</h2>
        <div className="create-actions">
          <button className="btn btn-success" onClick={() => setShowStudentPopup(true)}>
            <FaPlus /> Create New Student
          </button>
          <button className="btn btn-primary" onClick={() => setShowWardenPopup(true)} style={{ marginLeft: "10px" }}>
            <FaPlus /> Create New Warden
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-container" style={{ cursor: "pointer" }}>
        <div className={`stat-card total ${selectedTab === "ALL" ? "active" : ""}`} onClick={() => setSelectedTab("ALL")}>
          <FaUsers className="stat-icon" />
          <div>
            <h4>Total Users</h4>
            <p>{stats.total}</p>
          </div>
        </div>
        <div className={`stat-card active ${selectedTab === "ACTIVE" ? "active" : ""}`} onClick={() => setSelectedTab("ACTIVE")}>
          <FaUserGraduate className="stat-icon" />
          <div>
            <h4>Active</h4>
            <p>{stats.active}</p>
          </div>
        </div>
        <div className={`stat-card blocked ${selectedTab === "BLOCKED" ? "active" : ""}`} onClick={() => setSelectedTab("BLOCKED")}>
          <FaLock className="stat-icon" />
          <div>
            <h4>Blocked</h4>
            <p>{stats.blocked}</p>
          </div>
        </div>
        <div className={`stat-card deleted ${selectedTab === "DELETED" ? "active" : ""}`} onClick={() => setSelectedTab("DELETED")}>
          <FaTrash className="stat-icon" />
          <div>
            <h4>Deleted</h4>
            <p>{stats.deleted}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="page-header" style={{ margin: "20px 0" }}>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by anything..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="section-card">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Deleted?</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`user-row ${user.deleted ? "deleted" : user.blocked ? "blocked" : "active"}`}>
                  <td dangerouslySetInnerHTML={{ __html: highlightMatch(user.id.toString()) }} />
                  <td dangerouslySetInnerHTML={{ __html: highlightMatch(user.fullName) }} />
                  <td dangerouslySetInnerHTML={{ __html: highlightMatch(user.email) }} />
                  <td dangerouslySetInnerHTML={{ __html: highlightMatch(user.role) }} />
                  <td dangerouslySetInnerHTML={{ __html: highlightMatch(user.blocked ? "Blocked" : "Active") }} />
                  <td dangerouslySetInnerHTML={{ __html: highlightMatch(user.deleted ? "Yes" : "No") }} />
                  <td className="action-buttons">
                    {!user.deleted && (
                      <button className="btn btn-warning" onClick={() => handleBlockToggle(user)}>
                        <FaBan /> {user.blocked ? "Unblock" : "Block"}
                      </button>
                    )}
                    {user.deleted ? (
                      <button className="btn btn-info" onClick={() => handleUndelete(user.id)}>
                        <FaUndo /> Undelete
                      </button>
                    ) : (
                      <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>
                        <FaTrash /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Student Popup */}
      {showStudentPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={() => setShowStudentPopup(false)}>
              <FaTimes />
            </button>
            <h3>Create New Student</h3>
            <form className="popup-form">
              <input type="text" placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              {!confirmCreate ? (
                <button type="button" className="btn btn-success" onClick={() => setConfirmCreate(true)}>
                  Create Student
                </button>
              ) : (
                <div className="confirm-box">
                  <p>Are you sure?</p>
                  <div className="confirm-actions">
                    <button type="button" className="btn btn-confirm" onClick={handleConfirmStudent}>
                      Yes
                    </button>
                    <button type="button" className="btn btn-cancel" onClick={() => setConfirmCreate(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Create Warden Popup */}
      {showWardenPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={() => setShowWardenPopup(false)}>
              <FaTimes />
            </button>
            <h3>Create New Warden</h3>
            <form className="popup-form">
              <input type="text" placeholder="Full Name" value={wardenData.fullName} onChange={(e) => setWardenData({ ...wardenData, fullName: e.target.value })} />
              <input type="email" placeholder="Email" value={wardenData.email} onChange={(e) => setWardenData({ ...wardenData, email: e.target.value })} />
              <input type="password" placeholder="Password" value={wardenData.password} onChange={(e) => setWardenData({ ...wardenData, password: e.target.value })} />
              <input type="text" placeholder="Address" value={wardenData.address} onChange={(e) => setWardenData({ ...wardenData, address: e.target.value })} />
              <input type="number" placeholder="Age" value={wardenData.age} onChange={(e) => setWardenData({ ...wardenData, age: e.target.value })} />
              <input type="text" placeholder="City" value={wardenData.city} onChange={(e) => setWardenData({ ...wardenData, city: e.target.value })} />
              <input type="text" placeholder="Contact Number" value={wardenData.contactNumber} onChange={(e) => setWardenData({ ...wardenData, contactNumber: e.target.value })} />
              <input type="text" placeholder="Hostel Name" value={wardenData.hostelName} onChange={(e) => setWardenData({ ...wardenData, hostelName: e.target.value })} />
              <input type="text" placeholder="Nationality" value={wardenData.nationality} onChange={(e) => setWardenData({ ...wardenData, nationality: e.target.value })} />
              <input type="text" placeholder="State" value={wardenData.state} onChange={(e) => setWardenData({ ...wardenData, state: e.target.value })} />
              <input type="text" placeholder="Zip Code" value={wardenData.zipCode} onChange={(e) => setWardenData({ ...wardenData, zipCode: e.target.value })} />

              <button type="button" className="btn btn-success" onClick={handleConfirmWarden}>
                Create Warden
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
