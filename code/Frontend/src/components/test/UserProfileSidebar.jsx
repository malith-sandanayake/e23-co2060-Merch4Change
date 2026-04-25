import React from "react";
import test from "../../assets/test.jpg";
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

      <div className="lum-user-summary">
        <img src={test} alt="Alex Rivers" />
        <div>
          <h4>@{profileData?.userName || "unkonown"}</h4>
          <p>Premium User</p>
        </div>
      </div>

      <div className="lum-sidebar-nav">
        <div className="lum-nav-item active">
          <Home size={20} /> <span>Feed</span>
        </div>
        <div className="lum-nav-item">
          <MessageSquare size={20} /> <span>Messages</span>
        </div>
        <div className="lum-nav-item">
          <Layers size={20} /> <span>Collections</span>
        </div>
        <div className="lum-nav-item">
          <BarChart2 size={20} /> <span>Analytics</span>
        </div>
        <div className="lum-nav-item">
          <Heart size={20} /> <span>Donation</span>
        </div>
        <div className="lum-nav-item">
          <Settings size={20} /> <span>Settings</span>
        </div>
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

export default UserProfileSidebar;
