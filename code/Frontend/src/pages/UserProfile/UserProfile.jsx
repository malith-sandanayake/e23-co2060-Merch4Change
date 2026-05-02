import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import "../Home/Home.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import ProfileHeader from "./ProfileHeader/ProfileHeader";
import ProfileStats from "./ProfileStats/ProfileStats";
import ProfileHighlights from "./ProfileHighlights/ProfileHighlights";
import ProfileTabs from "./ProfileTabs/ProfileTabs";
import PostGrid from "./PostGrid/PostGrid";

function UserProfile() {
  const [profileData, setProfileData] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [activeTab, setActiveTab] = useState("POSTS");

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setLoadError(true);
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/v1/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        if (data?.success && data?.data?.user) {
          setProfileData(data.data.user);
        } else {
          setLoadError(true);
        }
      })
      .catch(() => setLoadError(true));
  }, []);

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
        profileData={profileData}
      />

      <div className="lum-layout">
        <Sidebar
          profileData={profileData}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        <main className="lum-main-content" style={{ padding: 0 }}>
          <ProfileHeader profileData={profileData} />
          <ProfileStats profileData={profileData} />
          <ProfileHighlights />
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <PostGrid />
        </main>

        <RightSidebar page="profile" />
      </div>
    </div>
  );
}

export default UserProfile;
