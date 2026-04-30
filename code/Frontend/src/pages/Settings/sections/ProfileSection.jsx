import React from "react";
import "./SettingsSection.css";

function ProfileSection({ profileData }) {
  return (
    <div className="s-section">
      <h2 className="s-section__title">Edit profile</h2>
      <p className="s-section__desc">Update your personal information and how it appears to others.</p>
      <div className="s-avatar-row">
        <div className="s-avatar">{(profileData?.userName?.[0] || "U").toUpperCase()}</div>
        <div className="s-avatar-info">
          <span className="s-avatar-name">{profileData?.userName || "unknown"}</span>
          <span className="s-avatar-sub">Premium User</span>
        </div>
        <button className="s-btn s-btn--ghost">Change photo</button>
      </div>
      <div className="s-row"><label className="s-label">Username</label><input className="s-input" type="text" defaultValue={profileData?.userName || ""} /></div>
      <div className="s-row"><label className="s-label">Full name</label><input className="s-input" type="text" defaultValue={profileData?.fullName || ""} /></div>
      <div className="s-row"><label className="s-label">Bio</label><input className="s-input" type="text" placeholder="Write something about yourself..." /></div>
      <div className="s-row"><label className="s-label">Website</label><input className="s-input" type="url" placeholder="https://yourwebsite.com" /></div>
      <div className="s-row"><label className="s-label">Email</label><input className="s-input" type="email" defaultValue={profileData?.email || ""} /></div>
      <div className="s-divider" />
      <button className="s-btn s-btn--primary">Save changes</button>
    </div>
  );
}

export default ProfileSection;
