import React, { useState } from 'react';
import "./Sidebar.css";
import icon from "../../assets/icon.png"
import home from "../../assets/sidebar_icons/home.svg"
import explore from "../../assets/sidebar_icons/explore.svg"
import message from "../../assets/sidebar_icons/message.svg"
import notification from "../../assets/sidebar_icons/notification.svg"
import profilePic from "../../assets/test.jpg"
import settings from "../../assets/sidebar_icons/settings.svg"
import more from "../../assets/sidebar_icons/more.svg"
import create from "../../assets/sidebar_icons/create.svg"

function Sidebar() {

  const [extended, setExtended] = useState(false);

  function handleSideBar() {
    if (extended) {
      setExtended(false);
    } else {
      setExtended(true);
    }
  }

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={icon} alt="icon" style={{ maxWidth: "40px", borderRadius: 10 }} onClick={handleSideBar} />
      </div>

      <nav className="nav-links">
        <div className={`nav-item ${extended ? "extended" : ""}`}>
          <img src={home} className="sidebar_icons" />
          <p>Home</p>
        </div>

        <div className={`nav-item ${extended ? "extended" : ""}`}>
          <img src={explore} className="sidebar_icons" />
          <p>Explore</p>
        </div>

        <div className={`nav-item ${extended ? "extended" : ""}`}>
          <img src={message} className="sidebar_icons" />
          <p>Messages</p>
        </div>

        <div className={`nav-item ${extended ? "extended" : ""}`}>
          <img src={notification} className="sidebar_icons" />
          <p>Notifications</p>
        </div>

        <div className={`nav-item ${extended ? "extended" : ""}`}>
          <img src={create} className="sidebar_icons" />
          <p>Create</p>
        </div>

        <div className={`nav-item ${extended ? "extended" : ""}`}>
          <img src={profilePic} className="profile-image" />
          <p>Profile</p>
        </div>
      </nav>


      <div className="sidebar-bottom">
        <div className={`nav-item ${extended ? "extended" : ""}`}>
          <img src={settings} className="sidebar_icons" />
          <p>Settings</p>
        </div>

        <div className={`nav-item ${extended ? "extended" : ""}`}>
          <img src={more} className="sidebar_icons" />
          <p>More</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;