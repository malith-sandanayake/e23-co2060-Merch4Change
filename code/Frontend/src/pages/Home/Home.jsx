import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Home.css";
import Feed from "../../components/Feed/Feed";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import UserProfileSidebar from "../../components/test/UserProfileSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import Marketplace from "../../components/Marketplace/Marketplace";

const VALID_TABS = new Set(["feed", "discover", "marketplace", "trends"]);

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [profileData, setProfileData] = useState({
    firstName: "Guest",
    lastName: "User", 
    userName: "guest",
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const currentTab = searchParams.get("tab");
  const activeTab = VALID_TABS.has(currentTab) ? currentTab : "feed";
  const isFeedTab = activeTab === "feed";
  const effectiveSidebarCollapsed = isSidebarCollapsed;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/v1/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          setProfileData(data.data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleTabChange = useCallback((tab) => {
    setSearchParams(tab === "feed" ? {} : { tab });
    setIsSidebarCollapsed(tab !== "feed");
  }, [setSearchParams]);

  return (
    <div className={`luminous-app ${effectiveSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <TopNavbar
        isSidebarCollapsed={effectiveSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        profileData={profileData}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="lum-layout">
        <UserProfileSidebar
          profileData={profileData}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        <main className="lum-main-content home-main-content">
          {activeTab === "feed" && <Feed />}
          {activeTab === "marketplace" && <Marketplace />}
          {activeTab === "discover" && <p>Discover coming soon</p>}
          {activeTab === "trends" && <p>Trends coming soon</p>}
        </main>

        {isFeedTab && <RightSidebar page="home" />}
      </div>
    </div>
  );
}

export default Home;
