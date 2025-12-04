import React from "react";

const QuickActionCard = ({ icon, label, onClick }) => {
  return (
    <div className="dashboard-card" onClick={onClick}>
      <div className="icon-circle">{icon}</div>
      <p>{label}</p>
    </div>
  );
};

export default QuickActionCard;
