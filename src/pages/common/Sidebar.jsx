
import { useNavigate } from "react-router-dom";

const Sidebar = ({ menuItems, isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index} onClick={() => { navigate(item.path); toggleSidebar(false); }}>
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
