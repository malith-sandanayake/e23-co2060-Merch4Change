import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Home/Home.css";
import "./Marketplace.css";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import MarketplaceContent from "../../components/Marketplace/Marketplace";
import GuestBlock from "../../components/Marketplace/components/GuestBlock";

function MarketplacePage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    firstName: "Guest",
    lastName: "User",
    userName: "guest",
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

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
      .catch(() => { })
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleTabChange = useCallback(
    (tab) => {
      if (tab === "marketplace") return;
      if (tab === "feed") {
        navigate("/home");
        return;
      }

      navigate(`/home?tab=${tab}`);
    },
    [navigate]
  );

  return (
    <div className={`luminous-app ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <TopNavbar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        profileData={profileData}
        activeTab="marketplace"
        onTabChange={handleTabChange}
      />

      <div className="lum-layout">
        <Sidebar
          profileData={profileData}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        <main className="lum-main-content home-main-content">
          {isLoading ? (
             <div className="mk-loading-wrap">
               <div className="mk-spinner" />
               <p>Verifying access...</p>
             </div>
          ) : !token ? (
            <GuestBlock />
          ) : (
            <MarketplaceContent />
          )}
        </main>
      </div>
    </div>
  );
}

export default MarketplacePage;
