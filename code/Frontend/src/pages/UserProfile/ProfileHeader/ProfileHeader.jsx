import React from 'react';
import './ProfileHeader.css';
import userImage from '../../../assets/user.svg';
import verifiedIcon from '../../../assets/verified_icon.png';
import { BarChart2, Link2, MapPin, CalendarDays, Pencil, ImagePlus, MessageSquare, Heart, BadgeCheck } from 'lucide-react';

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

function ProfileHeader({
  profileData,
  isEditing = false,
  onEditClick = () => {},
  onChangeProfilePhoto = () => {},
  onChangeCoverPhoto = () => {},
  isOwnProfile = true,
  isFollowing = false,
  onFollowClick = () => {},
  onMessageClick = () => {},
  isOrganization = false,
  verificationStatus = null,
  onDonateClick = () => {},
  badges = []
}) {
  const fullName = `${capitalize(profileData?.firstName)} ${capitalize(profileData?.lastName)}`.trim() || 'Anonymous';
  const coverStyle = profileData?.coverImageUrl
    ? { backgroundImage: `linear-gradient(135deg, rgba(26, 10, 92, 0.35) 0%, rgba(74, 36, 225, 0.35) 55%, rgba(123, 82, 244, 0.35) 100%), url(${profileData.coverImageUrl})` }
    : undefined;

  return (
    <div className="ph-wrapper">
      {/* Cover */}
      <div className={`ph-cover ${isEditing ? 'ph-cover--editable' : ''}`} style={coverStyle}>
        {isEditing && (
          <div className="ph-cover-actions">
            <button className="ph-cover-btn" onClick={onChangeCoverPhoto} type="button">
              <ImagePlus size={14} />
              Change cover photo
            </button>
          </div>
        )}
      </div>

      {/* Avatar + Actions row */}
      <div className="ph-row">
        <div className="ph-avatar-ring">
          <img
            src={profileData?.profileImageUrl || userImage}
            alt={profileData?.userName || 'avatar'}
            className="ph-avatar"
          />
          <span className="ph-online-dot" title="Online" />
          {isEditing && (
            <button className="ph-avatar-action" onClick={onChangeProfilePhoto} type="button">
              <ImagePlus size={13} />
            </button>
          )}
        </div>

        <div className="ph-actions">
          {isOwnProfile && (
            <button 
              className="ph-btn-secondary" 
              onClick={onEditClick} 
              title={isEditing ? 'Editing profile' : 'Edit Profile'} 
              type="button"
              style={{ padding: '8px 12px' }}
            >
              <Pencil size={16} />
            </button>
          )}
          {isOwnProfile && (
            <button className="ph-btn-primary">
              <BarChart2 size={14} />
              Dashboard
            </button>
          )}
          {!isOwnProfile && (
            <button
              className={isFollowing ? "ph-btn-secondary" : "ph-btn-primary"}
              onClick={onFollowClick}
              type="button"
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
          {!isOwnProfile && (
            <button
              className="ph-btn-secondary"
              onClick={onMessageClick}
              type="button"
              title="Message"
              style={{ padding: '8px 12px' }}
            >
              <MessageSquare size={16} />
            </button>
          )}
          {isOrganization && !isOwnProfile && (
            <button
              className="ph-btn-primary"
              onClick={onDonateClick}
              disabled={verificationStatus !== 'verified'}
              title={verificationStatus !== 'verified' ? "This organization is not verified yet" : "Donate coins"}
              style={{ background: 'var(--primary-color)' }}
            >
              <Heart size={14} fill="currentColor" />
              Donate
            </button>
          )}
        </div>
      </div>

      {/* Identity block */}
      <div className="ph-identity">
        {/* Name + verified */}
        <div className="ph-name-row">
          <h1 className="ph-name">{fullName}</h1>
          {profileData?.isVerified && !isOrganization && (
            <img src={verifiedIcon} alt="Verified" className="ph-verified" />
          )}
          {isOrganization && verificationStatus === "verified" && (
            <BadgeCheck className="ph-verified-badge" size={20} color="var(--primary-color)" style={{ marginLeft: "4px" }} />
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

        {/* Tags row (for Orgs) */}
        {isOrganization && (
          <div className="ph-meta-row" style={{ marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {verificationStatus === "verified" && <span className="ph-tag ph-tag-green">Verified Charity</span>}
            {verificationStatus === "pending" && <span className="ph-tag ph-tag-yellow">Verification Pending</span>}
            {verificationStatus === "rejected" && <span className="ph-tag ph-tag-red">Verification Rejected</span>}
            {verificationStatus === "unsubmitted" && <span className="ph-tag ph-tag-gray">Not Verified</span>}
            {badges.map((b, i) => <span key={i} className="ph-tag">{b}</span>)}
          </div>
        )}
        
        {/* Stats inline */}
        <div className="ph-stats-inline">
          <div className="ph-stat-item">
            <strong>{profileData?.postsCount || 0}</strong> <span>posts</span>
          </div>
          <div className="ph-stat-item">
            <strong>{profileData?.followersCount || 0}</strong> <span>followers</span>
          </div>
          <div className="ph-stat-item">
            <strong>{profileData?.followingCount || 0}</strong> <span>following</span>
          </div>
          {profileData?.accountType === 'organization' && (
            <div className="ph-stat-item">
              <strong>{profileData?.projectsCount || 0}</strong> <span>projects</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;