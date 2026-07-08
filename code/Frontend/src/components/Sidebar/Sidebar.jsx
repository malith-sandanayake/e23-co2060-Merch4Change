import React, { memo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import CreatePostModal from "../CreatePostModal/CreatePostModal";
import { useAuth } from "../../context/Context";
import {
  Home,
  MessageSquare,
  Search,
  Bell,
  Store,
  Layers,
  BarChart2,
  Settings,
  Plus,
  X,
  Heart,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";

function Sidebar({ profileData, setIsSidebarCollapsed, onPostCreated }) {
  const [selectedOption, setSelectedOption] = useState(0);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const navigate = useNavigate();
  const { user: storedUser } = useAuth();
  const userRole = profileData?.role || storedUser?.role;
  const userAccountType = profileData?.accountType || storedUser?.accountType;
  const isAdmin = userRole === "admin";
  const showVerifyLink =
    userAccountType === "organization" && userRole !== "charity";

  const handleSelectOption = (value) => {
    setSelectedOption(value);
  };

  return (
    <aside className="lum-sidebar-left">
      <div className="lum-logo">
        <div className="lp-navbar-icon">M</div>
        <h2 className="lp-navbar-text">Merch4Change</h2>
        <button
          className="lum-close-btn"
          onClick={() => setIsSidebarCollapsed(true)}
        >
          <X size={20} />
        </button>
      </div>

      <div className="lum-sidebar-nav">
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
          onClick={() => handleSelectOption(1)}
        >
          <Home size={20} /> <span>Home</span>
        </NavLink>
        <div
          className={selectedOption === 'search' ? "lum-nav-item active" : "lum-nav-item"}
          onClick={() => {
            handleSelectOption('search');
            // Assuming clicking search in left sidebar focuses or navigates to search
            navigate("/search");
          }}
        >
          <Search size={20} /> <span>Search</span>
        </div>
        <NavLink
          to="/messaging"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
          onClick={() => handleSelectOption(2)}
        >
          <MessageSquare size={20} /> <span>Messages</span>
        </NavLink>
        <NavLink
          to="/notifications"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
          onClick={() => handleSelectOption('notifications')}
        >
          <Bell size={20} /> <span>Notifications</span>
        </NavLink>
        <NavLink
          to="/marketplace"
          className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
          onClick={() => handleSelectOption('marketplace')}
        >
          <Store size={20} /> <span>Marketplace</span>
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
        {showVerifyLink && (
          <NavLink
            to="/charity/verify"
            className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
            onClick={() => handleSelectOption(7)}
          >
            <ShieldCheck size={20} /> <span>Verify Organization</span>
          </NavLink>
        )}
        {isAdmin && (
          <NavLink
            to="/admin/charities"
            className={({ isActive }) => (isActive ? "lum-nav-item active" : "lum-nav-item")}
            onClick={() => handleSelectOption(8)}
          >
            <ClipboardList size={20} /> <span>Charity Verification</span>
          </NavLink>
        )}
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
        onClick={() => setIsCreatePostOpen(true)}
      >
        <Plus size={20} /> <span>Create Post</span>
      </button>

      <CreatePostModal 
        isOpen={isCreatePostOpen} 
        onClose={() => setIsCreatePostOpen(false)} 
        onSuccess={(newPost) => {
          if (typeof onPostCreated === "function") {
            onPostCreated(newPost);
          }
        }}
      />

      
    </aside>
  );
}

export default memo(Sidebar);