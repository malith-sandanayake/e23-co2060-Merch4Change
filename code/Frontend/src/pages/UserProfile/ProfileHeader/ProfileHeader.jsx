import React from 'react';
import './ProfileHeader.css';
import userImage from '../../../assets/user.svg';
import verifiedIcon from '../../../assets/verified_icon.png';
import { BarChart2, Link2, MapPin, CalendarDays, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatLink(url) {
  if (!url) return url;
  return url.replace(/^https?:\/\/(www\.)?/, '');
}

function ensureHttp(url) {
  if (!url) return '#';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function ProfileHeader({ profileData }) {
  const navigate = useNavigate();
  const fullName = `${capitalize(profileData?.firstName)} ${capitalize(profileData?.lastName)}`.trim() || 'Anonymous';

  return (
    <div className="ph-wrapper">
      {/* Cover */}
      <div className="ph-cover" />

      {/* Avatar + Actions row */}
      <div className="ph-row">
        <div className="ph-avatar-ring">
          <img
            src={userImage}
            alt={profileData?.userName || 'avatar'}
            className="ph-avatar"
          />
          <span className="ph-online-dot" title="Online" />
        </div>

        <div className="ph-actions">
          <button
            className="ph-btn-secondary"
            onClick={() => navigate('/settings?section=profile')}
            title="Edit your profile"
          >
            <Pencil size={14} />
            Edit Profile
          </button>
          <button className="ph-btn-primary">
            <BarChart2 size={14} />
            Dashboard
          </button>
        </div>
      </div>

      {/* Identity block */}
      <div className="ph-identity">
        {/* Name + verified */}
        <div className="ph-name-row">
          <h1 className="ph-name">{fullName}</h1>
          {profileData?.isVerified && (
            <img src={verifiedIcon} alt="Verified" className="ph-verified" />
          )}
        </div>

        {/* Username */}
        {profileData?.userName && (
          <p className="ph-username">@{profileData.userName}</p>
        )}

        {/* Bio */}
        {profileData?.profileBio && (
          <p className="ph-bio">{profileData.profileBio}</p>
        )}

        {/* Meta row — location, joined, link */}
        <div className="ph-meta-row">
          {profileData?.location && (
            <span className="ph-meta-chip">
              <MapPin size={13} />
              {profileData.location}
            </span>
          )}
          <span className="ph-meta-chip">
            <CalendarDays size={13} />
            Joined {profileData?.createdAt
              ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : 'recently'}
          </span>
          {profileData?.userLink && (
            <a
              href={ensureHttp(profileData.userLink)}
              target="_blank"
              rel="noreferrer noopener"
              className="ph-meta-chip ph-link-chip"
              title={profileData.userLink}
            >
              <Link2 size={13} />
              {formatLink(profileData.userLink)}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;