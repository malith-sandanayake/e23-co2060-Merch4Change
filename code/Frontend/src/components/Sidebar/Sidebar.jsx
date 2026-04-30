import React from "react";
import "./Sidebar.css";
import test from "../../assets/test.jpg";
import home from "../../assets/sidebar_icons/home.svg";
import explore from "../../assets/sidebar_icons/explore.svg";
import settings from "../../assets/sidebar_icons/settings.svg";

function Sidebar() {
  return (
    <div className="left-sidebar">
      <div className="ls-profile">
        <img src={test} alt="profile" className="ls-profile-img" />
        <div className="ls-profile-info">
          <h4>Alex Rivers</h4>
          <p>PLATINUM MEMBER</p>
        </div>
      </div>

      <nav className="ls-nav">
        <div className="ls-nav-item active">
          <img src={home} alt="home" className="ls-icon" />
          <span>Home</span>
          <span className="ls-dot"></span>
        </div>
        
        <div className="ls-nav-item">
          <img src={explore} alt="explore" className="ls-icon" />
          <span>Explore</span>
        </div>
        
        <div className="ls-nav-item">
          <span className="ls-emoji-icon">👗</span>
          <span>My Closet</span>
        </div>
        
        <div className="ls-nav-item">
          <span className="ls-emoji-icon">❤️</span>
          <span>Favorites</span>
        </div>
        
        <div className="ls-nav-item">
          <img src={settings} alt="settings" className="ls-icon" />
          <span>Settings</span>
        </div>
      </nav>

      <button className="ls-post-btn">
        <span className="ls-plus">+</span> Post New Item
      </button>
    </div>
  );
}

export default Sidebar;
