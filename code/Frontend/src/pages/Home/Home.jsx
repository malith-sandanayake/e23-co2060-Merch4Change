import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Home.css";
import Feed from "../../components/Feed/Feed";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";

const VALID_TABS = new Set(["feed", "discover", "trends"]);

function Home() {
  const navigate = useNavigate();
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
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
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
    if (tab === "marketplace") {
      navigate("/marketplace");
      return;
    }

    if (tab === "discover" || tab === "trends") {
      navigate("/under-construction");
      return;
    }

    setSearchParams(tab === "feed" ? {} : { tab });
    setIsSidebarCollapsed(tab !== "feed");
  }, [navigate, setSearchParams]);

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
        <Sidebar
          profileData={profileData}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        <main className="lum-main-content home-main-content">
          {activeTab === "feed" && <Feed />}
          {activeTab === "discover" && <p>Discover coming soon</p>}
          {activeTab === "trends" && <p>Trends coming soon</p>}
        </main>

        {isFeedTab && <RightSidebar page="home" />}
      </div>
    </div>
  );
}

export default Home;