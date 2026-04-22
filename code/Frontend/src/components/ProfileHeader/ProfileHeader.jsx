import React from 'react';
import './ProfileHeader.css';
import test from '../../assets/test.jpg';
import verifiedIcon from '../../assets/verified_icon.png';
import { BarChart2 } from 'lucide-react';

function ProfileHeader() {
  return (
    <div className="lum-profile-header">
      <div className="lum-cover-image"></div>

      <div className="lum-profile-info-row">
        <div className="lum-avatar-container">
          <img src={test} alt="Alex Rivers" className="lum-main-avatar" />
        </div>

        <div className="lum-profile-actions">
          <button className="lum-edit-btn">Edit Profile</button>
          <button className="lum-dash-btn"><BarChart2 size={16} /> View Dashboard</button>
        </div>
      </div>

      <div className="lum-profile-details">
        <h1>Alex Rivers <img src={verifiedIcon} alt="Verified" className="verified-badge-img" /></h1>
        <p>@alexrivers &bull; Digital Visionary & Curator</p>
      </div>
    </div>
  );
}

export default ProfileHeader;
