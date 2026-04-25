import React from 'react';
import './ProfileTabs.css';

function ProfileTabs({ activeTab = "POSTS" }) {
  const tabs = ["POSTS", "SHOP", "TAGGED", "SAVED"];

  return (
    <div className="lum-tabs">
      {tabs.map((tab) => (
        <span 
          key={tab} 
          className={`lum-tab ${activeTab === tab ? 'active' : ''}`}
        >
          {tab}
        </span>
      ))}
    </div>
  );
}

export default ProfileTabs;
