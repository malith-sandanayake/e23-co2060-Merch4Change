import { Bell, Menu, Search } from "lucide-react";
import test from "../../assets/test.jpg";
import "./TopNavbar.css";

function TopNavbar({ isSidebarCollapsed, setIsSidebarCollapsed }) {
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
        <span>Discover</span>
        <span>Marketplace</span>
        <span>Trends</span>
        <div className="lum-icon-btn"><Bell size={20} /></div>
        <div className="lum-profile-btn">
          <img src={test} alt="profile" />
          <span>Profile</span>
        </div>
      </div>
    </nav>
  );
}

export default TopNavbar;
