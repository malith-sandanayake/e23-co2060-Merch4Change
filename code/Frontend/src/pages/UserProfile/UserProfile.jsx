import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import UserProfileSidebar from "../../components/test/UserProfileSidebar";
import UserMenu from "../../components/UserMenu/UserMenu";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import ProfileStats from "../../components/ProfileStats/ProfileStats";
import PostGrid from "../../components/PostGrid/PostGrid";

function UserProfile() {
  const [profileData, setProfileData] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/v1/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfileData(data.data.user);
      })
      .catch(() => { });
  }, []);

  if (!profileData){
    return <div>Page is Loading</div>
  }

  return (
    <div className={`luminous-app ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Top Navbar */}
      <UserMenu
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <div className="lum-layout">
        {/* Left Sidebar */}
        <UserProfileSidebar
          profileData={profileData}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        {/* Main Content */}
        <main className="lum-main-content">
          <ProfileHeader />
          <ProfileStats />
          
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
        </main>

        {/* Right Sidebar */}
        <RightSidebar page="profile" />
      </div>
    </div>
  );
}

export default UserProfile;
