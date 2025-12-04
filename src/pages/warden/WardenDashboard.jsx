import React from "react";

const WardenDashboard = () => {
  const email = localStorage.getItem("token") ? localStorage.getItem("email") : null;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🛡️ Warden Dashboard</h1>
      {email && <p>Logged in as: {email}</p>}
      <ul>
        <li>Verify Documents</li>
        <li>Monitor Activity Logs</li>
        <li>Manage Reports</li>
      </ul>
    </div>
  );
};

export default WardenDashboard;