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
        <div className="lum-profile-btn" onClick={() => navigate("/profile/me")}>
          <img src={test} alt="profile" />
          <span>
            {profileData?.firstName?.charAt(0).toUpperCase() + profileData?.firstName?.slice(1)} {" "}
            {profileData?.lastName?.charAt(0).toUpperCase() + profileData?.lastName?.slice(1)}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default TopNavbar;
