import React from 'react';
import './ProfileHeader.css';
import userImage from '../../../assets/user.svg';
import verifiedIcon from '../../../assets/verified_icon.png';
import { BarChart2 } from 'lucide-react';

function ProfileHeader({ profileData }) {
  return (
    <div className="lum-profile-header">
      <div className="lum-cover-image"></div>

      <div className="lum-profile-info-row">
        <div className="lum-avatar-container">
          <img src={userImage} alt={profileData?.userName} className="lum-main-avatar" />
        </div>

        <div className="lum-profile-actions">
          <button className="lum-edit-btn">Edit Profile</button>
          <button className="lum-dash-btn"><BarChart2 size={16} /> View Dashboard</button>
        </div>
      </div>

      <div className="lum-profile-details">
        <h1>
          {profileData?.firstName?.charAt(0).toUpperCase() + profileData?.firstName?.slice(1)} {" "}
          {profileData?.lastName?.charAt(0).toUpperCase() + profileData?.lastName?.slice(1)}
          <img src={verifiedIcon} alt="Verified" className="verified-badge-img" />
        </h1>
        <p>@{profileData.userName} &bull; Digital Visionary & Curator</p>
      </div>
    </div>
  );
}

export default ProfileHeader;
