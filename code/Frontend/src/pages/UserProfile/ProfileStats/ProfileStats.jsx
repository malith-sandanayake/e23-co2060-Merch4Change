import React from 'react';
import './ProfileStats.css';
import { Grid, Users, UserCheck, Tag } from 'lucide-react';

function ProfileStats({ profileData }) {
  const stats = [
    { icon: <Grid size={16} />, value: profileData?.postsCount ?? 0, label: 'POSTS' },
    { icon: <Users size={16} />, value: profileData?.followersCount ?? 0, label: 'FOLLOWERS' },
    { icon: <UserCheck size={16} />, value: profileData?.followingCount ?? 0, label: 'FOLLOWING' },
    { icon: <Tag size={16} />, value: profileData?.salesCount ?? 0, label: 'SALES' },
  ];

  return (
    <div className="lum-stats-row">
      {stats.map((s) => (
        <div key={s.label} className="lum-stat">
          <div className="stat-icon-wrapper">{s.icon}</div>
          <div className="stat-text">
            <h3>{s.value}</h3>
            <p>{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProfileStats;
