import "./Home.css";
import Feed from "../../components/Feed/Feed";
import Sidebar from "../../components/Sidebar/Sidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import test from "../../assets/test.jpg";
import notification from "../../assets/sidebar_icons/notification.svg";
import message from "../../assets/sidebar_icons/message.svg";
import search from "../../assets/sidebar_icons/search.svg";

function Home() {
  return (
    <div className="home-container">
      {/* Top Navbar Prototype */}
      <nav className="top-navbar">
        <div className="nav-left">
          <h1 className="brand-logo">Curated</h1>
          <div className="nav-links">
            <span className="active">Feed</span>
            <span>Marketplace</span>
            <span>Communities</span>
            <span>Trending</span>
          </div>
        </div>

        <div className="nav-center">
          <div className="search-bar">
            <img src={search} alt="search" />
            <input type="text" placeholder="Search curated collections..." />
          </div>
        </div>

        <div className="nav-right">
          <span className="nav-icon cart-icon">🛒</span>
          <img src={notification} alt="notifications" className="nav-icon" />
          <img src={message} alt="messages" className="nav-icon" />
          <img src={test} alt="profile" className="nav-profile-pic" />
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="home-content">
        <Sidebar />
        <Feed />
        <RightSidebar />
      </div>
    </div>
  );
}

export default Home;
