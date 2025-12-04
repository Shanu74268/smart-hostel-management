import React from "react";
import "../../styles/MessMenu.css";

const MessMenu = () => {
  const menu = [
    { day: "Monday", breakfast: "Poha & Tea", lunch: "Rajma Chawal", dinner: "Roti, Paneer Butter Masala, Rice" },
    { day: "Tuesday", breakfast: "Paratha & Curd", lunch: "Chole Rice", dinner: "Dal Tadka, Jeera Rice, Salad" },
    { day: "Wednesday", breakfast: "Idli Sambar", lunch: "Kadhi Chawal", dinner: "Roti, Mix Veg, Rice" },
    { day: "Thursday", breakfast: "Upma & Tea", lunch: "Aloo Matar, Roti", dinner: "Dal Makhani, Rice, Salad" },
    { day: "Friday", breakfast: "Sandwich & Juice", lunch: "Veg Pulao, Raita", dinner: "Roti, Chole, Rice" },
    { day: "Saturday", breakfast: "Poori Bhaji", lunch: "Fried Rice, Manchurian", dinner: "Roti, Aloo Gobi, Rice" },
    { day: "Sunday", breakfast: "Special Dosa", lunch: "Biryani", dinner: "Paneer Tikka, Roti, Rice" },
  ];

  return (
    <div className="messmenu-wrapper">
      <h1 className="messmenu-title">🍽️ Weekly Mess Menu</h1>
      <p className="messmenu-subtitle">Your delicious week at a glance</p>

      <div className="table-container">
        <table className="messmenu-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((item, index) => (
              <tr key={index}>
                <td>{item.day}</td>
                <td>{item.breakfast}</td>
                <td>{item.lunch}</td>
                <td>{item.dinner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessMenu;
