import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Users,
  Heart,
  Star,
  MessageCircle,
  ExternalLink,
  X,
  Plus,
  Coins,
  BadgeCheck,
} from "lucide-react";
import "./OrgProfile.css";
import L from "leaflet";
import DonationModal from "../../components/donations/DonationModal";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import ProfileHeader from "../UserProfile/ProfileHeader/ProfileHeader";
import ProfileTabs from "../UserProfile/ProfileTabs/ProfileTabs";

const hqIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const OrgProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [orgData, setOrgData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [profileData, setProfileData] = useState({}); // For current user's coins
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("PROJECTS");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(`/api/v1/orgs/profile/${username}`);
        if (res.data?.success) {
          const { user, charity, projects } = res.data.data;
          setOrgData({ ...user, ...charity });
          setProjects(projects);
          setFollowersCount(user.followersCount);
        }
      } catch (err) {
        console.error("Error fetching org profile:", err);
        setError("Failed to load organization profile.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMyProfile = async () => {
      try {
        const res = await apiClient.get("/api/v1/profile/me");
        if (res.data?.success) setProfileData(res.data.data.user);
      } catch (err) {
        console.error("Error fetching my profile:", err);
      }
    };

    fetchData();
    fetchMyProfile();
  }, [username]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
  };

  const openDonationModal = (projectName = "") => {
    setSelectedProject(projectName);
    setDonationModalOpen(true);
  };

  const handleDonationCommitted = (spentCoins, remainingCoins) => {
    setProfileData((prev) => ({
      ...prev,
      coinBalance: remainingCoins,
    }));
  };

  if (isLoading) {
    return (
      <div className="profile-loading flex-center">
        <div className="loader"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !orgData) {
    return (
      <div className="profile-error flex-center">
        <h2>Oops!</h2>
        <p>{error || "Organization not found."}</p>
        <Link to="/home" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  // Mock locations for the map (Yellow and Green contribution zones)
  const contributionLocations = [
    {
      id: 1,
      pos: [51.505, -0.09],
      color: "#10B981",
      name: "Water Sanitation Project",
    }, // Green
    {
      id: 2,
      pos: [48.8566, 2.3522],
      color: "#F59E0B",
      name: "Education Initiative",
    }, // Yellow
    {
      id: 3,
      pos: [40.7128, -74.006],
      color: "#10B981",
      name: "Community Well",
    }, // Green
    {
      id: 4,
      pos: [34.0522, -118.2437],
      color: "#F59E0B",
      name: "School Building",
    }, // Yellow
  ];

  const isVerified = orgData.verificationStatus === "verified";
  const isOwner = profileData?.userName === orgData.userName;
  const verificationStatus = orgData.verificationStatus || "unsubmitted";

  return (
    <div className={`luminous-app ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <TopNavbar 
        profileData={profileData} 
        isSidebarCollapsed={isSidebarCollapsed} 
        setIsSidebarCollapsed={setIsSidebarCollapsed} 
      />
      <div className="lum-layout">
        <Sidebar 
          profileData={profileData} 
          setIsSidebarCollapsed={setIsSidebarCollapsed} 
        />
        <main className="lum-main-content">
          <div className="profile-wrapper">
            {isOwner && verificationStatus !== "verified" && (
              <div className={`org-verify-banner org-verify-banner--${verificationStatus}`}>
                <div>
                  <strong>
                    {verificationStatus === "pending" && "Your verification is under review."}
                    {verificationStatus === "rejected" && "Your verification was rejected."}
                    {verificationStatus === "unsubmitted" && "Complete verification to receive donations."}
                  </strong>
                  {verificationStatus === "rejected" && orgData.rejectionReason && (
                    <p>{orgData.rejectionReason}</p>
                  )}
                </div>
                <button type="button" className="btn btn-primary" onClick={() => navigate("/charity/verify")}>
                  {verificationStatus === "rejected" ? "Resubmit" : "Verify now"}
                </button>
              </div>
            )}
            {/* Profile Header Component */}
            <div className="profile-content">
            <ProfileHeader 
              profileData={{
                firstName: orgData.publicName,
                lastName: "",
                userName: orgData.userName,
                profileBio: orgData.description,
                userLink: orgData.website,
                isVerified: false,
                accountType: "organization",
                profileImageUrl: orgData.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(orgData.publicName)}&background=4F46E5&color=fff&size=150`,
                followersCount: followersCount,
                followingCount: orgData.followingCount || 0,
                projectsCount: projects.length,
                postsCount: 0
              }}
              isOwnProfile={isOwner}
              isFollowing={isFollowing}
              onFollowClick={handleFollow}
              isOrganization={true}
              verificationStatus={verificationStatus}
              onDonateClick={() => openDonationModal()}
              badges={[]} // Additional badges if needed
            />
            
            {/* Action Row specific to Orgs (Map / Impact) */}
            {!isOwner && (
              <div style={{ display: 'flex', gap: '1rem', padding: '1rem', alignItems: 'center', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', marginTop: '1rem' }}>
                <button
                  className="btn btn-secondary flex-center gap-xs"
                  onClick={() => setIsMapOpen(true)}
                  style={{ flex: 1 }}
                >
                  <MapPin size={16} />
                  View Impact Map
                </button>
                <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
                  <span style={{ color: 'var(--primary-color)' }}>LKR {(projects.reduce((acc, p) => acc + p.collectedAmount, 0) * 100).toLocaleString()}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>Total Impact</span>
                </div>
              </div>
            )}
            
            <div style={{ marginTop: '2rem' }}></div>

        <ProfileTabs 
          tabs={['POSTS', 'PROJECTS']} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {activeTab === 'PROJECTS' && (
          <div className="projects-section bg-card shadow-sm">
            <div className="section-header flex-between">
              <h2>Ongoing Projects</h2>
            <Link to={`/organization/${username}/projects`} className="view-all">
              View All <ExternalLink size={14} />
            </Link>
          </div>
          <div className="projects-grid">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="project-card premium-card">
                  <div className="project-image">
                    <img src={`https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80`} alt={project.title} />
                    <div className="project-tag">Active</div>
                  </div>
                  <div className="project-body">
                    <h3>{project.title}</h3>
                    <p className="project-desc">{project.description}</p>
                    <div className="project-progress-container">
                      <div className="progress-labels">
                        <span className="pct-funded">{Math.round((project.collectedAmount / project.goalAmount) * 100)}% funded</span>
                        <span className="coins-left">{(project.goalAmount - project.collectedAmount).toLocaleString()} coins to go</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${Math.min(100, (project.collectedAmount / project.goalAmount) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="progress-footer">
                        <span>{project.collectedAmount.toLocaleString()} collected</span>
                        <span>Goal: {project.goalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <button 
                      className="btn-donate-action"
                      onClick={() => openDonationModal(project.title)}
                    >
                      Support Project
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-projects flex-center">
                <p className="text-muted">No active projects at the moment.</p>
              </div>
            )}
          </div>
        </div>
        )}

        {activeTab === 'POSTS' && (
          <div className="posts-section bg-card shadow-sm">
            <div className="posts-header">
              <h2>Recent Updates</h2>
            </div>
          <div className="posts-placeholder flex-center">
            <Heart size={48} className="text-muted" strokeWidth={1} />
            <h3>No posts yet</h3>
            <p className="text-muted">
              When Global Hope Foundation posts updates, they'll appear here.
            </p>
          </div>
          </div>
        )}
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
              <MapContainer
                center={[30, 0]}
                zoom={2}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {contributionLocations.map((loc) => (
                  <CircleMarker
                    key={loc.id}
                    center={loc.pos}
                    radius={10}
                    pathOptions={{
                      color: loc.color,
                      fillColor: loc.color,
                      fillOpacity: 0.7,
                    }}
                  >
                    <Popup>{loc.name}</Popup>
                  </CircleMarker>
                ))}

                {/* HQ Marker */}
                <Marker position={[46.2044, 6.1432]} icon={hqIcon}>
                  <Popup>
                    <strong>Global HQ</strong>
                    <br /> Geneva, Switzerland
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      )}
            </div>
          </main>
        </div>

        <DonationModal
          isOpen={donationModalOpen}
          onClose={() => setDonationModalOpen(false)}
          onSuccess={(name) => {
            setDonationModalOpen(false);
            alert(`Thank you for donating to ${name}!`);
          }}
          initialProject={selectedProject}
          initialCharityId={isVerified ? orgData.id : ""}
          initialCharityName={orgData.publicName}
          availableCoins={profileData.coinBalance || 0}
          onDonationCommitted={handleDonationCommitted}
        />
      </div>
  );
};

export default OrgProfile;
