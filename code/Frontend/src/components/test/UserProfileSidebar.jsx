import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import user from "../../assets/user.svg";
import "./UserProfileSidebar.css";
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

function UserProfileSidebar({ profileData, setIsSidebarCollapsed }) {
  const navigate = useNavigate();

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
          navigate("/profile/me");
        }}
      >
        <img src={user} alt="Alex Rivers" />
        <div>
          <h4>@{profileData?.userName || "unkonown"}</h4>
          <p>Premium User</p>
        </div>
      </div>

      <div className="lum-sidebar-nav">
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
        >
          <Home size={20} /> <span>Home</span>
        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
        >
          <MessageSquare size={20} /> <span>Messages</span>
        </NavLink>
        <NavLink
          to="/collections"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
        >
          <Layers size={20} /> <span>Collections</span>
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
        >
          <BarChart2 size={20} /> <span>Analytics</span>
        </NavLink>
        <NavLink
          to="/donation"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
        >
          <Heart size={20} /> <span>Donation</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
        >
          <Settings size={20} /> <span>Settings</span>
        </NavLink>
      </div>

      <button className="lum-create-btn">
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

export default React.memo(UserProfileSidebar);
