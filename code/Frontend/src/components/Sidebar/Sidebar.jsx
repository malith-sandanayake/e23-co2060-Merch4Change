import React, { memo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import user from "../../assets/user.svg";
import "./Sidebar.css";
import {
  Home,
  MessageSquare,
  Layers,
  BarChart2,
  Settings,
  Plus,
  X,
  Heart,
} from "lucide-react";

function Sidebar({ profileData, setIsSidebarCollapsed }) {
  const [selectedOption, setSelectedOption] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectOption = (value) => {
    setSelectedOption(value);
  };

  return (
    <aside className="lum-sidebar-left">
      <div className="lum-logo">
        <div className="lum-logo-icon">L</div>
        <h2>Merch4Change</h2>
        <button
          className="lum-close-btn"
          onClick={() => setIsSidebarCollapsed(true)}
        >
          <X size={20} />
        </button>
      </div>

      <div
        className={`lum-user-summary ${location.pathname === "/profile/me" ? "lum-user-summary2" : ""}`}
        onClick={() => {
          handleSelectOption(0);
          navigate("/profile/me");
        }}
      >
        <img src={user} alt="Alex Rivers" />
        <div>
          <h4>@{profileData?.userName || "unknown"}</h4>
          <p>Premium User</p>
        </div>
      </div>

      <div className="lum-sidebar-nav">
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
          onClick={() => handleSelectOption(1)}
        >
          <Home size={20} /> <span>Home</span>
        </NavLink>
        <NavLink
          to="/messaging"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
          onClick={() => handleSelectOption(2)}
        >
          <MessageSquare size={20} /> <span>Messages</span>
        </NavLink>
        <div
          className={selectedOption === 3 ? "lum-nav-item active" : "lum-nav-item"}
          onClick={() => {
            handleSelectOption(3);
            navigate("/under-construction");
          }}
        >
          <Layers size={20} /> <span>Collections</span>
        </div>
        <div
          className={selectedOption === 4 ? "lum-nav-item active" : "lum-nav-item"}
          onClick={() => {
            handleSelectOption(4);
            navigate("/under-construction");
          }}
        >
          <BarChart2 size={20} /> <span>Analytics</span>
        </div>
        <NavLink
          to="/donations"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
          onClick={() => handleSelectOption(5)}
        >
          <Heart size={20} /> <span>Donations</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
          onClick={() => handleSelectOption(6)}
        >
          <Settings size={20} /> <span>Settings</span>
        </NavLink>
      </div>

      <button 
        className="lum-create-btn"
        onClick={() => navigate("/under-construction")}
      >
        <Plus size={20} /> <span>Create Post</span>
      </button>

      <div className="lum-pro-banner">
        <p className="pro-title">PRO PLAN</p>
        <p className="pro-desc">Unlock deeper analytics & exclusive minting tools.</p>
        <button className="pro-btn">Upgrade Now</button>
      </div>
    </aside>
  );
}

export default memo(Sidebar);
