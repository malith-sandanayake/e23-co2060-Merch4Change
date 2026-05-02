import React, { useState } from 'react';
import './ProfileTabs.css';

const TABS = ['POSTS', 'SHOP', 'TAGGED', 'SAVED'];

function ProfileTabs({ activeTab = 'POSTS', onTabChange }) {
  const handleClick = (tab) => {
    if (typeof onTabChange === 'function') onTabChange(tab);
  };

  return (
    <div className="lum-tabs">
      {TABS.map((tab) => (
        <span
          key={tab}
          className={`lum-tab ${activeTab === tab ? 'active' : ''}`}
          onClick={() => handleClick(tab)}
          role="tab"
          aria-selected={activeTab === tab}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClick(tab)}
        >
          {tab}
        </span>
      ))}
    </div>
  );
}

export default ProfileTabs;
