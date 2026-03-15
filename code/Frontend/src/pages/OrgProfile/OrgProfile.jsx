import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';  //loading leaflet deafult styling into the project
import { MapPin, Users, Heart, Star, MessageCircle, ExternalLink, X } from 'lucide-react';
import './OrgProfile.css';
import L from 'leaflet';

const hqIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const OrgProfile = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [followersCount, setFollowersCount] = useState(12450);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  // Mock locations for the map (Yellow and Green contribution zones)
  const contributionLocations = [
    { id: 1, pos: [51.505, -0.09], color: '#10B981', name: 'Water Sanitation Project' }, // Green
    { id: 2, pos: [48.8566, 2.3522], color: '#F59E0B', name: 'Education Initiative' }, // Yellow
    { id: 3, pos: [40.7128, -74.0060], color: '#10B981', name: 'Community Well' }, // Green
    { id: 4, pos: [34.0522, -118.2437], color: '#F59E0B', name: 'School Building' }, // Yellow
  ];

  return (
    <div className="profile-wrapper">
      {/* Cover Photo */}
      <div className="cover-photo">
        <div className="cover-overlay"></div>
      </div>

      <div className="profile-content">
        {/* Header Section */}
        <div className="profile-header bg-card shadow-sm">
          <div className="profile-picture">
            <img src="https://ui-avatars.com/api/?name=Global+Hope&background=4F46E5&color=fff&size=150" alt="Global Hope Charity" />
          </div>
          
          <div className="profile-info">
            <div className="flex-between title-row">
              <div>
                <h1 className="profile-name">Global Hope Foundation</h1>
                <p className="profile-handle text-muted">@globalhope</p> 
              </div>
              <div className="header-actions">
                <button 
                  className={`btn ${isFollowing ? 'btn-following' : 'btn-primary'}`}
                  onClick={handleFollow}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="btn btn-secondary icon-btn">
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>

            <div className="profile-bio">
              <p><strong>Mission:</strong> To provide sustainable clean water and quality education to underprivileged communities worldwide.</p>
              <p><strong>Vision:</strong> A world where every child has access to the resources needed to thrive and build a better future.</p>
            </div>

            <div className="tags-container">
              <span className="tag tag-blue">Clean Water Initiative</span>
              <span className="tag tag-green">Education</span>
              <span className="tag tag-yellow">Community Development</span>
            </div>

            {/* Location & Ratings */}
            <div className="  meta-info">
              <button className="location-btn" onClick={() => setIsMapOpen(true)}>
                <MapPin size={16} />
                <span>Global HQ: Geneva, Switzerland (View Impact Map)</span>
              </button>
              <div className="rating">
                <Star size={16} className="text-accent" fill="#F59E0B" />
                <span>4.9 (2k+ Reviews)</span>
              </div>
            </div>  
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row bg-card shadow-sm">
          <div className="stat-box">
            <span className="stat-value">{followersCount.toLocaleString()}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">342</span>
            <span className="stat-label">Following</span>
          </div>
          <Link to="/projects" className="stat-box clickable">
            <span className="stat-value">84</span>
            <span className="stat-label flex-center gap-xs">Total Projects <ExternalLink size={14}/></span>
          </Link>
          <Link to="/communities" className="stat-box clickable text-primary">
            <span className="stat-value">12</span>
            <span className="stat-label flex-center gap-xs">Communities <ExternalLink size={14}/></span>
          </Link>
        </div>

        {/* Posts Placeholder */}
        <div className="posts-section bg-card shadow-sm">
          <div className="posts-header">
            <h2>Recent Updates</h2>
            <div className="tabs">
              <button className="tab active">Posts</button>
              <button className="tab">Media</button>
            </div>
          </div>
          <div className="posts-placeholder flex-center">
            <Heart size={48} className="text-muted" strokeWidth={1} />
            <h3>No posts yet</h3>
            <p className="text-muted">When Global Hope Foundation posts updates, they'll appear here.</p>
          </div>
        </div>
      </div>

      {/* Map Modal */}
      {isMapOpen && (
        <div className="modal-overlay" onClick={() => setIsMapOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Areas of Impact</h2>
              <button className="close-btn" onClick={() => setIsMapOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="map-container">
              <MapContainer center={[30, 0]} zoom={2} style={{ height: '100%', width: '100%', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {contributionLocations.map(loc => (
                  <CircleMarker 
                    key={loc.id} 
                    center={loc.pos} 
                    radius={10} 
                    pathOptions={{ color: loc.color, fillColor: loc.color, fillOpacity: 0.7 }}
                  >
                    <Popup>{loc.name}</Popup>
                  </CircleMarker>
                ))}
                
                {/* HQ Marker */}
                <Marker position={[46.2044, 6.1432]} icon={hqIcon}>
                  <Popup>
                    <strong>Global HQ</strong><br /> Geneva, Switzerland
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgProfile;
