import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../context/Context";
import "./UserProfile.css";
import "../Home/Home.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import ProfileHeader from "./ProfileHeader/ProfileHeader";
import ProfileStats from "./ProfileStats/ProfileStats";
import ProfileHighlights from "./ProfileHighlights/ProfileHighlights";
import ProfileTabs from "./ProfileTabs/ProfileTabs";
import PostGrid from "./PostGrid/PostGrid";

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
      .then((res) => {
        const data = res.data;
        if (data?.success && data?.data?.user) {
          setProfileData(data.data.user);
          setEditForm(buildEditForm(data.data.user));
          setIsFollowing(!!data.data.isFollowing);
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

  return (
    <div
      className={`luminous-app ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <TopNavbar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        profileData={currentUser || profileData}
      />

      <div className="lum-layout">
        <Sidebar
          profileData={currentUser || profileData}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          onPostCreated={loadPosts}
        />

        <main className="lum-main-content" style={{ padding: 0 }}>
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
          />

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

          <ProfileStats profileData={profileData} />
          <ProfileHighlights />
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <PostGrid posts={posts} isLoading={isPostsLoading} onDeletePost={handleDeletePost} isOwnProfile={isOwnProfile} />

        </main>
      </div>
    </div>
  );
}

export default UserProfile;
