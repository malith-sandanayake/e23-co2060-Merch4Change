import React from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import SearchDropdown from '../TopNavbar/search/SearchDropdown';
import './RightSidebar.css';
import defaultUserPic from '../../assets/user.svg';
import test from '../../assets/test.jpg';

import { useNavigate } from 'react-router-dom';
import { getSuggestedUsers, followUser } from '../../api/profileService';
import toast from 'react-hot-toast';

function RightSidebarSearch() {
  const { query, setQuery, results, loading, open, setOpen } = useSearch();
  const containerRef = React.useRef(null);

  return (
    <div className="rs-search-container" style={{ position: 'relative' }} ref={containerRef}>
      <Search className="rs-search-icon" size={18} />
      <input 
        type="text" 
        className="rs-search-input" 
        placeholder="Search profiles, drops..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (results) setOpen(true); }}
      />
      {loading && <div style={{ marginLeft: 8, fontSize: '12px' }}>⏳</div>}
      <SearchDropdown query={query} results={results} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function SuggestedSection({ showViewAll = false }) {
  const [suggestedUsers, setSuggestedUsers] = React.useState([]);
  const [followingMap, setFollowingMap] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const response = await getSuggestedUsers();
        if (response?.data?.suggestedUsers) {
          setSuggestedUsers(response.data.suggestedUsers);
        }
      } catch (error) {
        console.error("Failed to fetch suggested users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggested();
  }, []);

  const handleFollow = async (e, user) => {
    e.stopPropagation(); // prevent navigation to profile
    if (followingMap[user._id]) return; // already following in UI

    // Optimistic UI update
    setFollowingMap(prev => ({ ...prev, [user._id]: true }));
    try {
      await followUser(user.userName);
      toast.success(`Followed ${user.firstName || user.userName}`);
    } catch (error) {
      toast.error("Failed to follow user");
      // Revert optimistic update
      setFollowingMap(prev => ({ ...prev, [user._id]: false }));
    }
  };

  const handleNavigate = (username) => {
    navigate(`/profile/${username}`);
  };

  if (loading) return null;
  if (suggestedUsers.length === 0) return null;

  return (
    <div className="rs-card">
      <div className="rs-header">
        <h3>Suggested for You</h3>
        {showViewAll ? <span className="rs-more">View All</span> : <span className="rs-more"></span>}
      </div>
      <div className="rs-users">
        {suggestedUsers.map((user) => (
          <div 
            className="rs-user" 
            key={user._id} 
            onClick={() => handleNavigate(user.userName)}
            style={{ cursor: 'pointer' }}
          >
            <img src={user.profileImageUrl || defaultUserPic} alt={user.userName} />
            <div className="rs-user-info">
              <h4>{user.firstName ? `${user.firstName} ${user.lastName}` : user.userName}</h4>
              <p>@{user.userName}</p>
            </div>
            <button 
              className="rs-follow-btn" 
              onClick={(e) => handleFollow(e, user)}
              style={followingMap[user._id] ? { background: '#f0f2f5', color: '#1a1a1a', border: '1px solid #ccc' } : {}}
            >
              {followingMap[user._id] ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RightSidebar({ page = "home" }) {
  if (page === "profile") {
    return (
      <aside className="right-sidebar right-sidebar-profile">
        <RightSidebarSearch />
        <SuggestedSection showViewAll />

        <div className="rs-card">
          <div className="rs-header">
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

        <div className="rs-card">
          <div className="rs-header">
            <h3>RECENT REVIEWS</h3>
          </div>
          <div className="widget-reviews">
            <div className="review-item">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"The quality of the digital assets is unmatched. Alex is a visionary."</p>
              <div className="reviewer">
                <img src={test} alt="user" />
                <span>@sasha_g &bull; 2d ago</span>
              </div>
            </div>
            <div className="review-item">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Beautiful aesthetic, fast delivery on physical drops. 10/10 recommend."</p>
              <div className="reviewer">
                <img src={test} alt="user" />
                <span>@j_vose &bull; 4d ago</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <div className="right-sidebar">
      <RightSidebarSearch />
      <SuggestedSection />

      <div className="rs-card">
        <div className="rs-header">
          <h3>Trending Topics</h3>
        </div>
        <div className="rs-tags">
          <span className="rs-tag">#CyberMondayEarly</span>
          <span className="rs-tag">#LinenSummer</span>
          <span className="rs-tag">#SustainableLux</span>
          <span className="rs-tag">#MinimalistDecor</span>
          <span className="rs-tag">#SneakerHead2025</span>
        </div>
      </div>

      <div className="rs-card rs-live">
        <div className="rs-live-header">
          <span className="live-dot"></span>
          <h3>Live Community</h3>
        </div>
        <div className="rs-live-feed">
          <div className="rs-live-item">
            <img src={test} alt="user" />
            <p><strong>Mia Richards</strong> just grabbed the <span className="highlight">Midnight Blazer</span>. Only 3 left!</p>
          </div>
          <div className="rs-live-item">
            <img src={test} alt="user" />
            <p><strong>Arjun Singh</strong> added <span className="highlight">Velocity Sneakers</span> to their wishlist.</p>
          </div>
        </div>
        <div className="rs-happening">
          <p className="happening-label">HAPPENING NOW</p>
          <h4>428 people are browsing this drop</h4>
        </div>
      </div>

      <div className="rs-footer">
        <a href="#">About</a>
        <a href="#">Accessibility</a>
        <a href="#">Help Center</a>
        <a href="#">Privacy & Terms</a>
        <a href="#">Advertising</a>
        <p>© 2026 Merch4Change</p>
      </div>
    </div>
  );
}

export default RightSidebar;
