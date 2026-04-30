import "./Feed.css";
import Post from "../Post/Post";
import test from "../../assets/test.jpg";

function Feed() {
  return (
    <div className="center-feed">
      {/* Stories Section */}
      <div className="stories-container">
        <div className="story-item">
          <div className="story-img-container add-story">
            <span className="add-plus">+</span>
          </div>
          <p>Your Story</p>
        </div>
        <div className="story-item">
          <div className="story-img-container has-story">
            <img src={test} alt="story" />
          </div>
          <p>Elena.V</p>
        </div>
        <div className="story-item">
          <div className="story-img-container has-story">
            <img src={test} alt="story" />
          </div>
          <p>Marcus_K</p>
        </div>
        <div className="story-item">
          <div className="story-img-container has-story">
            <img src={test} alt="story" />
          </div>
          <p>Zoe.Studio</p>
        </div>
        <div className="story-item">
          <div className="story-img-container has-story">
            <img src={test} alt="story" />
          </div>
          <p>Liam.Design</p>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="promo-banner">
        <div className="promo-content">
          <span className="promo-badge">FLASH DROP</span>
          <h2>Midnight Velvet Collection</h2>
          <p>Exclusive early access for Platinum Members. Sale ends in 04:22:15.</p>
          <button className="promo-btn">Shop the Drop</button>
        </div>
      </div>

      {/* Posts */}
      <div className="posts">
        <Post />
      </div>

      {/* Trending Now Section */}
      <div className="trending-now">
        <div className="trending-header">
          <h3>Trending Now</h3>
          <a href="#">View All</a>
        </div>
        <div className="trending-items">
          <div className="trending-card">
            <div className="trending-img placeholder-img-1">
              <span className="trending-tag">#1 Trending</span>
            </div>
            <div className="trending-info">
              <h4>Air-Flow Velocity Red</h4>
              <div className="price-rating">
                <span className="price">$189.00</span>
                <span className="rating">⭐ 4.9 (2.1k)</span>
              </div>
            </div>
          </div>
          <div className="trending-card">
            <div className="trending-img placeholder-img-2">
              <span className="trending-tag staff-pick">Staff Pick</span>
            </div>
            <div className="trending-info">
              <h4>Nexus Pro Smartwatch</h4>
              <div className="price-rating">
                <span className="price">$299.00</span>
                <span className="rating">⭐ 4.8 (856)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
