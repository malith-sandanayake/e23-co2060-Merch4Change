import React from 'react';
import './ProfileHeader.css';
import test from '../../assets/test.jpg';
import verifiedIcon from '../../assets/verified_icon.png';
import { BarChart2, Grid, Users, UserCheck, Tag } from 'lucide-react';
import PostGrid from '../PostGrid/PostGrid';

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

      <div className="lum-stats-row">
        <div className="lum-stat">
          <div className="stat-icon-wrapper"><Grid size={16} /></div>
          <div className="stat-text">
            <h3>1.2k</h3>
            <p>POSTS</p>
          </div>
        </div>
        <div className="lum-stat">
          <div className="stat-icon-wrapper"><Users size={16} /></div>
          <div className="stat-text">
            <h3>45.8k</h3>
            <p>FOLLOWERS</p>
          </div>
        </div>
        <div className="lum-stat">
          <div className="stat-icon-wrapper"><UserCheck size={16} /></div>
          <div className="stat-text">
            <h3>850</h3>
            <p>FOLLOWING</p>
          </div>
        </div>
        <div className="lum-stat">
          <div className="stat-icon-wrapper"><Tag size={16} /></div>
          <div className="stat-text">
            <h3>312</h3>
            <p>SALES</p>
          </div>
        </div>
      </div>

      <div className="lum-highlights">
        <div className="lum-highlight">
          <div className="highlight-ring"><div className="highlight-img bg-1"></div></div>
          <p>Reviews</p>
        </div>
        <div className="lum-highlight">
          <div className="highlight-ring"><div className="highlight-img bg-2"></div></div>
          <p>Drops</p>
        </div>
        <div className="lum-highlight">
          <div className="highlight-ring"><div className="highlight-img bg-3"></div></div>
          <p>Closet</p>
        </div>
        <div className="lum-highlight">
          <div className="highlight-ring"><div className="highlight-img bg-4"></div></div>
          <p>BTS</p>
        </div>
        <div className="lum-highlight">
          <div className="highlight-ring empty-ring"><span>+</span></div>
          <p>New</p>
        </div>
      </div>

      <div className="lum-badges">
        <span className="lum-badge purple-badge">🌟 TOP SELLER</span>
        <span className="lum-badge blue-badge">🚀 EARLY ADOPTER</span>
        <span className="lum-badge green-badge">🛡 VERIFIED CURATOR</span>
      </div>

      <div className="lum-tabs">
        <span className="lum-tab active">POSTS</span>
        <span className="lum-tab">SHOP</span>
        <span className="lum-tab">TAGGED</span>
        <span className="lum-tab">SAVED</span>
      </div>

      <PostGrid />
    </div>
  );
}

export default ProfileHeader;
