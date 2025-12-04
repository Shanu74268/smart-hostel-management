// src/context/ProfileContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const [profilePic, setProfilePic] = useState("/default-profile.png");
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const statusRes = await axios.get(
          "http://localhost:8080/student/profile/status",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (statusRes.data === true) {
          const profileRes = await axios.get(
            "http://localhost:8080/student/profile",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setProfileData(profileRes.data);
          setProfilePic(
            profileRes.data.profilePicUrl || "/default-profile.png"
          );
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <ProfileContext.Provider
      value={{ profilePic, setProfilePic, profileData, setProfileData }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
