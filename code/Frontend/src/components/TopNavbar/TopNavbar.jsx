import { memo, useEffect, useRef, useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import test from "../../assets/test.jpg";
import "./TopNavbar.css";

function TopNavbar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  profileData,
  activeTab,
  onTabChange,
}) {
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowLogoutPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTabClick = (tab) => {
    if (typeof onTabChange === "function") {
      onTabChange(tab);
      return;
    }

    if (tab === "feed") {
      navigate("/home");
      return;
    }

    navigate(`/home?tab=${tab}`);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      await fetch(`${apiUrl}/api/v1/auth/logout`, {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });
    } catch {
      // Even if the request fails, clear local auth state client-side.
    } finally {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      setShowLogoutPopup(false);
      navigate("/login");
    }
  };

  return (
    <nav className="lum-topbar">
      <div className="lum-topbar-left">
        <button
          className="lum-menu-btn"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <Menu size={24} />
        </button>
        <div className="lum-search">
          <Search size={18} color="#888" />
          <input type="text" placeholder="Search creators, drops, or trends..." />
        </div>
      </div>
      <div className="lum-nav-links">
        <span
          className={activeTab === "feed" ? "lum-nav-link active" : "lum-nav-link"}
          onClick={() => handleTabClick("feed")}
        >
          Feed
        </span>
        <span
          className={activeTab === "discover" ? "lum-nav-link active" : "lum-nav-link"}
          onClick={() => handleTabClick("discover")}
        >
          Discover
        </span>
        <span
          className={activeTab === "marketplace" ? "lum-nav-link active" : "lum-nav-link"}
          onClick={() => handleTabClick("marketplace")}
        >
          Marketplace
        </span>
        <span
          className={activeTab === "trends" ? "lum-nav-link active" : "lum-nav-link"}
          onClick={() => handleTabClick("trends")}
        >
          Trends
        </span>
        <div className="lum-icon-btn"><Bell size={20} /></div>
        <div className="lum-profile-menu" ref={popupRef}>
          <button
            type="button"
            className="lum-profile-btn"
            onClick={() => setShowLogoutPopup((prev) => !prev)}
          >
            <img src={test} alt="profile" />
            <span>
              {profileData?.firstName?.charAt(0).toUpperCase() + profileData?.firstName?.slice(1)} {" "}
              {profileData?.lastName?.charAt(0).toUpperCase() + profileData?.lastName?.slice(1)}
            </span>
          </button>

          {showLogoutPopup && (
            <div className="lum-logout-popup">
              <p>Do you want to logout?</p>
              <div className="lum-logout-actions">
                <button type="button" className="lum-logout-cancel" onClick={() => setShowLogoutPopup(false)}>
                  Cancel
                </button>
                <button type="button" className="lum-logout-confirm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default memo(TopNavbar);
