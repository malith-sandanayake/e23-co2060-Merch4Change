import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
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

  const [option, setOption] = useState(0);
  const navigate = useNavigate();
  function handleSelectOption(value) {
    setOption(value)
  }
 
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

      <div className={`lum-user-summary ${option === 0 ? "lum-user-summary2" : ""}`} onClick={() => handleSelectOption(0)}>
        <img src={user} alt="Alex Rivers" />
        <div>
          <h4>@{profileData?.userName || "unkonown"}</h4>
          <p>Premium User</p>
        </div>
      </div>

      <div className="lum-sidebar-nav">
        <div
          className={option == 1 ? "lum-nav-item active" : "lum-nav-item"}
          onClick={() => {
            handleSelectOption(1);
            navigate("/home");
          }}
        >
          <Home size={20} /> <span>Feed</span>
        </div>
        <div className={option == 2? "lum-nav-item active": "lum-nav-item"} onClick={() => handleSelectOption(2)}>
          <MessageSquare size={20} /> <span>Messages</span>
        </div>
        <div className={option == 3? "lum-nav-item active": "lum-nav-item"} onClick={() => handleSelectOption(3)}>
          <Layers size={20} /> <span>Collections</span>
        </div>
        <div className={option == 4? "lum-nav-item active": "lum-nav-item"} onClick={() => handleSelectOption(4)}>
          <BarChart2 size={20} /> <span>Analytics</span>
        </div>
        <div className={option == 5? "lum-nav-item active": "lum-nav-item"} onClick={() => handleSelectOption(5)}>
          <Heart size={20} /> <span>Donation</span>
        </div>
        <div className={option == 6? "lum-nav-item active": "lum-nav-item"} onClick={() => handleSelectOption(6)}>
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
