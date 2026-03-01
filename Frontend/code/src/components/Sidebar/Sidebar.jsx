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
import search from "../../assets/sidebar_icons/search.svg"
import antigravity from "../../assets/sidebar_icons/antigravity.jpg"

function Sidebar() {

  const [extended, setExtended] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

  function getNavItemClass(itemKey) {
    return `nav-item ${activeItem === itemKey ? "active" : ""} ${extended ? "extended" : ""}`;
  }

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
        <div className={getNavItemClass("home")} onClick={() => setActiveItem("home")}>
          <img src={home} className="sidebar_icons" />
          <p>Home</p>
        </div>

        <div className={getNavItemClass("explore")} onClick={() => setActiveItem("explore")}>
          <img src={explore} className="sidebar_icons" />
          <p>Explore</p>
        </div>

        <div className={getNavItemClass("search")} onClick={() => setActiveItem("search")}>
          <img src={search} className="sidebar_icons" />
          <p>Search</p>
        </div>

        <div className={getNavItemClass("messages")} onClick={() => setActiveItem("messages")}>
          <img src={message} className="sidebar_icons" />
          <p>Messages</p>
        </div>

        <div className={getNavItemClass("notifications")} onClick={() => setActiveItem("notifications")}>
          <img src={notification} className="sidebar_icons" />
          <p>Notifications</p>
        </div>

        <div className={getNavItemClass("create")} onClick={() => setActiveItem("create")}>
          <img src={create} className="sidebar_icons" />
          <p>Create</p>
        </div>

        <div className={getNavItemClass("profile")} onClick={() => setActiveItem("profile")}>
          <img src={profilePic} className="profile-image" />
          <p>Profile</p>
        </div>
      </nav>


      <div className="sidebar-bottom">
        <div className={getNavItemClass("settings")} onClick={() => setActiveItem("settings")}>
          <img src={settings} className="sidebar_icons" />
          <p>Settings</p>
        </div>

        <div className={getNavItemClass("more")} onClick={() => setActiveItem("more")}>
          <img src={more} className="sidebar_icons" />
          <p>More</p>
        </div>

        <div className={getNavItemClass("team-antigravity")} onClick={() => setActiveItem("team-antigravity")}>
          <img src={antigravity} className="sidebar_icons" />
          <p>Team Antigravity</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;