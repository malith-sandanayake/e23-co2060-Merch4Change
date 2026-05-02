import React from 'react';
import './ProfileStats.css';
import { Grid, Users, UserCheck, Tag } from 'lucide-react';

function ProfileStats({ profileData }) {
  const posts = profileData.postsCount;
  const followers = profileData.followersCount;
  const following = profileData.followingCount;
  const sales = profileData.salesCount;
  return (
    <div className="lum-stats-row">
      <div className="lum-stat">
        <div className="stat-icon-wrapper"><Grid size={16} /></div>
        <div className="stat-text">
          <h3>{posts}</h3>
          <p>POSTS</p>
        </div>
      </div>
      <div className="lum-stat">
        <div className="stat-icon-wrapper"><Users size={16} /></div>
        <div className="stat-text">
          <h3>{followers}</h3>
          <p>FOLLOWERS</p>
        </div>
      </div>
      <div className="lum-stat">
        <div className="stat-icon-wrapper"><UserCheck size={16} /></div>
        <div className="stat-text">
          <h3>{following}</h3>
          <p>FOLLOWING</p>
        </div>
      </div>
      <div className="lum-stat">
        <div className="stat-icon-wrapper"><Tag size={16} /></div>
        <div className="stat-text">
          <h3>{sales}</h3>
          <p>SALES</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileStats;
