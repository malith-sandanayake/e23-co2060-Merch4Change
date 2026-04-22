import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import UserProfileSidebar from "../../components/test/UserProfileSidebar";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import ProfileStats from "../../components/ProfileStats/ProfileStats";
import ProfileHighlights from "../../components/ProfileHighlights/ProfileHighlights";
import ProfileTabs from "../../components/ProfileTabs/ProfileTabs";
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
      <TopNavbar
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
          
          <ProfileHighlights />

          <ProfileTabs activeTab="POSTS" />

          <PostGrid />
        </main>

        {/* Right Sidebar */}
        <RightSidebar page="profile" />
      </div>
    </div>
  );
}

export default UserProfile;
