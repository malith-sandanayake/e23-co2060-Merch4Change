import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import test from "../../assets/test.jpg";
import verifiedIcon from "../../assets/verified_icon.png";
import UserProfileSidebar from "../../components/test/UserProfileSidebar";
import UserMenu from "../../components/UserMenu/UserMenu";
import {
  BarChart2,
  Grid,
  Users,
  UserCheck,
  Tag,
} from "lucide-react";

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
          <div className="lum-profile-header">
            <div className="lum-cover-image"></div>

            <div className="lum-profile-info-row">
              <div className="lum-avatar-container">
                <img src={test} alt="Alex Rivers" className="lum-main-avatar" />
              </div>

              <div className="lum-profile-actions">
                <button className="lum-edit-btn">Edit Profile</button>
                <button className="lum-dash-btn"><BarChart2 size={16} /> View Dashboard</button>
              </div>
            </div>

            <div className="lum-profile-details">
              <h1>Alex Rivers <img src={verifiedIcon} alt="Verified" className="verified-badge-img" /></h1>
              <p>@alexrivers &bull; Digital Visionary & Curator</p>
            </div>

            <div className="lum-stats-row">
              <div className="lum-stat">
                <div className="stat-icon-wrapper"><Grid size={16} /></div>
                <div className="stat-text">
                  <h3>1.2k</h3>
                  <p>POSTS</p>
                </div>
              </div>
              <div className="lum-stat">
                <div className="stat-icon-wrapper"><Users size={16} /></div>
                <div className="stat-text">
                  <h3>45.8k</h3>
                  <p>FOLLOWERS</p>
                </div>
              </div>
              <div className="lum-stat">
                <div className="stat-icon-wrapper"><UserCheck size={16} /></div>
                <div className="stat-text">
                  <h3>850</h3>
                  <p>FOLLOWING</p>
                </div>
              </div>
              <div className="lum-stat">
                <div className="stat-icon-wrapper"><Tag size={16} /></div>
                <div className="stat-text">
                  <h3>312</h3>
                  <p>SALES</p>
                </div>
              </div>
            </div>

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

            <div className="lum-post-grid">
              <div className="lum-post-card">
                <div className="post-img card-bg-1"></div>
                <div className="post-info">
                  <h4>Neo-Tokyo Study</h4>
                  <p>Exploring the intersection of light and structure in urban environments.</p>
                  <div className="post-footer">
                    <span>❤ 2.4k</span>
                    <span>💬 128</span>
                    <span className="post-time">2h ago</span>
                  </div>
                </div>
              </div>

              <div className="lum-post-card">
                <div className="post-img card-bg-2">
                  <span className="limited-tag">LIMITED DROP</span>
                </div>
                <div className="post-info flex-row">
                  <h4>Prism Stride L1</h4>
                  <span className="post-price">$289.00</span>
                </div>
              </div>

              <div className="lum-post-card">
                <div className="post-img card-bg-3"></div>
                <div className="post-info">
                  <h4>Cyber Couture 2025</h4>
                  <p>A first look at the wearable light collection coming this fall.</p>
                </div>
              </div>

              <div className="lum-post-card">
                <div className="post-img card-bg-4"></div>
                <div className="post-info">
                  <h4>Ethereal Spaces</h4>
                  <p>New NFT collection dropping exclusive to Luminous Premium members.</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="lum-sidebar-right">
          <div className="lum-widget">
            <div className="widget-header">
              <h3>SUGGESTED FOR YOU</h3>
              <span>View All</span>
            </div>
            <div className="widget-list">
              <div className="widget-user">
                <img src={test} alt="user" />
                <div className="w-user-info">
                  <h4>Julian Vose</h4>
                  <p>Curator &bull; NY</p>
                </div>
                <button className="w-follow-btn">Follow</button>
              </div>
              <div className="widget-user">
                <img src={test} alt="user" />
                <div className="w-user-info">
                  <h4>Sasha Gray</h4>
                  <p>3D Artist</p>
                </div>
                <button className="w-follow-btn">Follow</button>
              </div>
              <div className="widget-user">
                <img src={test} alt="user" />
                <div className="w-user-info">
                  <h4>Liam Chen</h4>
                  <p>Architect</p>
                </div>
                <button className="w-follow-btn">Follow</button>
              </div>
            </div>
          </div>

          <div className="lum-widget">
            <div className="widget-header">
              <h3>USER'S TOP DROPS</h3>
            </div>
            <div className="widget-drops">
              <div className="drop-card">
                <div className="drop-img drop-bg-1"></div>
                <div className="drop-info">
                  <h4>Chrome Essence</h4>
                  <p>Ed. 1 of 50 &bull; $45.00</p>
                </div>
              </div>
              <div className="drop-card">
                <div className="drop-img drop-bg-2"></div>
                <div className="drop-info">
                  <h4>Velocity Red V2</h4>
                  <p>Exclusive &bull; $210.00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lum-widget">
            <div className="widget-header">
              <h3>RECENT REVIEWS</h3>
            </div>
            <div className="widget-reviews">
              <div className="review-item">
                <div className="stars">â­â­â­â­â­</div>
                <p>"The quality of the digital assets is unmatched. Alex is a visionary."</p>
                <div className="reviewer">
                  <img src={test} alt="user" />
                  <span>@sasha_g &bull; 2d ago</span>
                </div>
              </div>
              <div className="review-item">
                <div className="stars">â­â­â­â­â­</div>
                <p>"Beautiful aesthetic, fast delivery on physical drops. 10/10 recommend."</p>
                <div className="reviewer">
                  <img src={test} alt="user" />
                  <span>@j_vose &bull; 4d ago</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default UserProfile;




