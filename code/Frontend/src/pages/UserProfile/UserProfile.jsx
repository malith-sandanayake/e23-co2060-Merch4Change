import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../context/Context";
import "./UserProfile.css";
import "../Home/Home.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import ProfileHeader from "./ProfileHeader/ProfileHeader";
import ProfileHighlights from "./ProfileHighlights/ProfileHighlights";
import ProfileTabs from "./ProfileTabs/ProfileTabs";
import PostGrid from "./PostGrid/PostGrid";
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import DonationModal from "../../components/donations/DonationModal";
import { MapPin, X } from "lucide-react";

const hqIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const buildEditForm = (source = {}) => ({
  firstName: source.firstName || "",
  lastName: source.lastName || "",
  userName: source.userName || "",
  email: source.email || "",
  profileBio: source.profileBio || "",
  userLink: source.userLink || "",
  fullName: `${source.firstName || ""} ${source.lastName || ""}`.trim(),
});

function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { accessToken: token, user: currentUser } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [activeTab, setActiveTab] = useState("POSTS");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(buildEditForm());
  const [savingProfile, setSavingProfile] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
  const [uploadingCoverPhoto, setUploadingCoverPhoto] = useState(false);
  const [orgProjects, setOrgProjects] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const profilePhotoInputRef = useRef(null);
  const coverPhotoInputRef = useRef(null);

  const refreshProfile = async () => {
    if (!token) return null;
    const response = await apiClient.get("/api/v1/profile/me");
    const data = response.data;
    
    if (data?.success && data?.data?.user) {
      setProfileData(data.data.user);
      setEditForm(buildEditForm(data.data.user));
      return data.data.user;
    }
    throw new Error("Failed to load profile data");
  };

  const loadPosts = useCallback(async () => {
    if (!token) return;
    setIsPostsLoading(true);
    try {
      const isOwn = !username || username === "me" || (currentUser && username === currentUser.userName);
      const endpoint = isOwn ? "/api/v1/posts/me" : `/api/v1/posts/user/${username}`;
      const response = await apiClient.get(endpoint);
      const data = response.data;
      setPosts(Array.isArray(data?.posts) ? data.posts : []);
    } catch {
      setPosts([]);
    } finally {
      setIsPostsLoading(false);
    }
  }, [token, username, currentUser?.userName]);

  // 2. Fetch viewed profile data based on route username parameter
  useEffect(() => {
    if (!token) {
      setLoadError(true);
      return;
    }

    const isFetchingMe = !username || username === "me" || (currentUser && username === currentUser.userName);
    const endpoint = isFetchingMe ? "/api/v1/profile/me" : `/api/v1/profile/${username}`;

    setProfileData(null);
    apiClient.get(endpoint)
      .then(async (res) => {
        const data = res.data;
        if (data?.success && data?.data?.user) {
          const fetchedUser = data.data.user;
          setProfileData(fetchedUser);
          setEditForm(buildEditForm(fetchedUser));
          setIsFollowing(!!data.data.isFollowing);
          
          if (fetchedUser.accountType === 'organization') {
            try {
              setIsProjectsLoading(true);
              const orgRes = await apiClient.get(`/api/v1/orgs/profile/${fetchedUser.userName}`);
              if (orgRes.data?.success) {
                setOrgProjects(orgRes.data.data.projects || []);
              }
            } catch (err) {
              console.error("Error fetching org projects:", err);
            } finally {
              setIsProjectsLoading(false);
            }
          }
        } else {
          setLoadError(true);
        }
      })
      .catch(() => setLoadError(true));
  }, [token, username, currentUser?.userName]);

  useEffect(() => {
    if (!token) return;
    loadPosts();
  }, [loadPosts, token]);

  const isOwnProfile = !username || username === "me" || (currentUser && username === currentUser.userName);

  const handleFollowClick = async () => {
    if (!token || !profileData) return;
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const response = await apiClient.post(`/api/v1/profile/${profileData.userName}/${endpoint}`);
      const data = response.data;
      if (data.success) {
        setIsFollowing(data.data.isFollowing);
        setProfileData((prev) => ({
          ...prev,
          followersCount: prev.followersCount + (isFollowing ? -1 : 1),
        }));
      }
    } catch (err) {
      console.error("Failed to toggle follow status:", err);
    }
  };

  const handleMessageClick = () => {
    if (!profileData?._id) return;
    navigate(`/messaging?userId=${profileData._id}`);
  };


  const handleEditClick = () => {
    setEditForm(buildEditForm(profileData || {}));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditForm(buildEditForm(profileData || {}));
    setIsEditing(false);
  };

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setEditForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "fullName" ? { fullName: value } : {}),
    }));
  };

  const uploadImage = async ({ file, endpoint, onBusy }) => {
    if (!file) return;
    if (!token) throw new Error("Not authenticated");
    onBusy(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiClient.post(endpoint, formData);
      const data = response.data;
      if (!data.success) {
        throw new Error(data?.message || "Failed to upload image");
      }

      await refreshProfile();
    } finally {
      onBusy(false);
    }
  };

  const handleProfilePhotoChange = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    try {
      await uploadImage({
        file,
        endpoint: `/api/v1/images/user/${profileData?._id}`,
        onBusy: setUploadingProfilePhoto,
      });
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message || "Unable to upload profile photo");
    }
  };

  const handleCoverPhotoChange = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    try {
      await uploadImage({
        file,
        endpoint: `/api/v1/images/user/${profileData?._id}/cover`,
        onBusy: setUploadingCoverPhoto,
      });
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message || "Unable to upload cover photo");
    }
  };

  const handleSaveProfile = async () => {
    if (!token) {
      setLoadError(true);
      return;
    }

    setSavingProfile(true);
    try {
      const parts = editForm.fullName.trim().split(/\s+/).filter(Boolean);
      const firstName = parts.shift() || "";
      const lastName = parts.join(" ") || "";

      const response = await apiClient.put("/api/v1/profile/me", {
        firstName,
        lastName,
        userName: editForm.userName,
        email: editForm.email,
        profileBio: editForm.profileBio,
        userLink: editForm.userLink,
      });

      const data = response.data;
      if (!data.success) {
        throw new Error(data?.message || "Failed to update profile");
      }

      if (data?.success && data?.data?.user) {
        setProfileData(data.data.user);
        setEditForm(buildEditForm(data.data.user));
        setIsEditing(false);
        loadPosts();
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message || "Unable to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeletePost = async (post) => {
    if (!post?.id && !post?._id) return;

    const confirmed = window.confirm("Remove this post?");
    if (!confirmed) return;

    try {
      const postId = post.id || post._id;
      const response = await apiClient.delete(`/api/v1/posts/${postId}`);

      const data = response.data;
      if (!data.success) {
        throw new Error(data?.message || "Failed to delete post");
      }

      setPosts((currentPosts) => currentPosts.filter((item) => (item.id || item._id) !== postId));
      await refreshProfile();
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message || "Unable to delete post");
    }
  };

  const openProfilePhotoPicker = () => {
    if (profilePhotoInputRef.current) {
      profilePhotoInputRef.current.click();
    }
  };

  const openCoverPhotoPicker = () => {
    if (coverPhotoInputRef.current) {
      coverPhotoInputRef.current.click();
    }
  };

  if (loadError) {
    return (
      <div className="up-loading">
        <p>Unable to load profile. Please try again.</p>
      </div>
    );
  }

  if (!profileData) {
    return <div className="up-loading">Loading profile…</div>;
  }

  const isOrganization = profileData?.accountType === "organization";
  const verificationStatus = profileData?.verificationStatus || "unsubmitted";

  const contributionLocations = [
    { id: 1, pos: [51.505, -0.09], color: "#10B981", name: "Water Sanitation Project" },
    { id: 2, pos: [48.8566, 2.3522], color: "#F59E0B", name: "Education Initiative" },
    { id: 3, pos: [40.7128, -74.006], color: "#10B981", name: "Community Well" },
    { id: 4, pos: [34.0522, -118.2437], color: "#F59E0B", name: "School Building" },
  ];

  const handleDonationCommitted = (spentCoins, remainingCoins) => {
    // If we wanted to update current user's coin balance visually here
  };

  return (
    <div className={`luminous-app ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <TopNavbar profileData={currentUser || profileData} isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
      
      <div className="lum-layout">
        <Sidebar
          profileData={currentUser || profileData}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          onPostCreated={loadPosts}
        />

        <main className="lum-main-content" style={{ padding: 0 }}>
          <div className="up-constrained-section">
            {isOrganization && isOwnProfile && verificationStatus !== "verified" && (
              <div className={`org-verify-banner org-verify-banner--${verificationStatus}`} style={{ margin: "20px 20px 0 20px", borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>
                    {verificationStatus === "pending" && "Your verification is under review."}
                    {verificationStatus === "rejected" && "Your verification was rejected."}
                    {verificationStatus === "unsubmitted" && "Complete verification to receive donations."}
                  </strong>
                  {verificationStatus === "rejected" && profileData.rejectionReason && (
                    <p style={{ margin: "4px 0 0" }}>{profileData.rejectionReason}</p>
                  )}
                </div>
                <button type="button" className="btn btn-primary" onClick={() => navigate("/charity/verify")}>
                  {verificationStatus === "rejected" ? "Resubmit" : "Verify now"}
                </button>
              </div>
            )}

            <ProfileHeader
              profileData={profileData}
              isEditing={isEditing}
              onEditClick={handleEditClick}
              onChangeProfilePhoto={openProfilePhotoPicker}
              onChangeCoverPhoto={openCoverPhotoPicker}
              isOwnProfile={isOwnProfile}
              isFollowing={isFollowing}
              onFollowClick={handleFollowClick}
              onMessageClick={handleMessageClick}
              isOrganization={isOrganization}
              verificationStatus={verificationStatus}
              onDonateClick={() => setDonationModalOpen(true)}
              badges={[]}
            />

            {isOrganization && !isOwnProfile && (
              <div style={{ display: 'flex', gap: '1rem', padding: '1rem', alignItems: 'center', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', marginTop: '1rem', margin: '0 20px' }}>
                <button
                  className="btn btn-secondary flex-center gap-xs"
                  onClick={() => setIsMapOpen(true)}
                  style={{ flex: 1 }}
                >
                  <MapPin size={16} />
                  View Impact Map
                </button>
                <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
                  <span style={{ color: 'var(--primary-color)' }}>LKR {(orgProjects.reduce((acc, p) => acc + (p.collectedAmount || 0), 0) * 100).toLocaleString()}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>Total Impact</span>
                </div>
              </div>
            )}

            {isOwnProfile && isEditing && (
              <section className="up-edit-panel">
                <input
                  ref={profilePhotoInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProfilePhotoChange}
                />
                <input
                  ref={coverPhotoInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleCoverPhotoChange}
                />

                <div className="up-edit-grid">
                  <div className="up-edit-card up-edit-fields">
                    <div className="up-edit-card-title">Profile details</div>
                    <label className="up-edit-field">
                      <span>Username</span>
                      <input value={editForm.userName} onChange={handleFieldChange("userName")} />
                    </label>
                    <label className="up-edit-field">
                      <span>Full name</span>
                      <input value={editForm.fullName} onChange={handleFieldChange("fullName")} />
                    </label>
                    <label className="up-edit-field">
                      <span>Bio</span>
                      <textarea rows="4" value={editForm.profileBio} onChange={handleFieldChange("profileBio")} />
                    </label>
                    <label className="up-edit-field">
                      <span>Website</span>
                      <input value={editForm.userLink} onChange={handleFieldChange("userLink")} />
                    </label>
                    <label className="up-edit-field">
                      <span>Email</span>
                      <input type="email" value={editForm.email} onChange={handleFieldChange("email")} />
                    </label>
                    <div className="up-edit-actions">
                      <button className="up-edit-btn up-edit-btn--ghost" type="button" onClick={handleCancelEdit} disabled={savingProfile}>
                        Cancel
                      </button>
                      <button className="up-edit-btn up-edit-btn--primary" type="button" onClick={handleSaveProfile} disabled={savingProfile}>
                        {savingProfile ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <ProfileHighlights profileData={profileData} />
            <ProfileTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              tabs={profileData?.accountType === 'organization' ? ['POSTS', 'PROJECTS'] : ['POSTS', 'PRODUCTS']}
            />
          </div>
          
          <div className="up-full-width-section">
            {activeTab === 'POSTS' && (
              <PostGrid posts={posts} isLoading={isPostsLoading} onDeletePost={handleDeletePost} isOwnProfile={isOwnProfile} />
            )}
            
            {activeTab === 'PRODUCTS' && profileData?.accountType !== 'organization' && (
              <div className="posts-placeholder flex-center" style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ marginBottom: '1rem' }}>No products yet</h3>
                <p className="text-muted">
                  When {profileData?.firstName || username} adds products to their shop, they'll appear here.
                </p>
              </div>
            )}

            {activeTab === 'PROJECTS' && profileData?.accountType === 'organization' && (
              <div className="projects-section" style={{ padding: '2rem 0' }}>
                <div className="projects-grid">
                  {isProjectsLoading ? (
                    <div className="flex-center" style={{ width: '100%', padding: '3rem' }}>
                      <div className="loader"></div>
                    </div>
                  ) : orgProjects.length > 0 ? (
                    orgProjects.map((project) => (
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
                            onClick={() => {
                              setSelectedProject(project.title);
                              setDonationModalOpen(true);
                            }}
                          >
                            Support Project
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="posts-placeholder flex-center" style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', width: '100%' }}>
                      <h3 style={{ marginBottom: '1rem' }}>No projects yet</h3>
                      <p className="text-muted">
                        When {profileData?.firstName || username} starts a new project, it will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Map Modal */}
      {isMapOpen && (
        <div className="modal-overlay" onClick={() => setIsMapOpen(false)} style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '12px', width: '90%', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
              <h2 style={{ margin: 0 }}>Areas of Impact</h2>
              <button className="close-btn" onClick={() => setIsMapOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <div className="map-container" style={{ flex: 1 }}>
              <MapContainer
                center={[30, 0]}
                zoom={2}
                style={{ height: "100%", width: "100%", borderRadius: "0 0 12px 12px" }}
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
                    pathOptions={{ color: loc.color, fillColor: loc.color, fillOpacity: 0.7 }}
                  >
                    <Popup>{loc.name}</Popup>
                  </CircleMarker>
                ))}
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

      {isOrganization && (
        <DonationModal
          isOpen={donationModalOpen}
          onClose={() => setDonationModalOpen(false)}
          onSuccess={(name) => {
            setDonationModalOpen(false);
            alert(`Thank you for donating to ${name}!`);
          }}
          initialProject={selectedProject}
          initialCharityId={verificationStatus === 'verified' ? profileData.id : ""}
          initialCharityName={profileData.firstName || profileData.userName}
          availableCoins={currentUser?.coinBalance || 0}
          onDonationCommitted={handleDonationCommitted}
        />
      )}
    </div>
  );
}

export default UserProfile;
