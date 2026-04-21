import React from 'react';
import './RightSidebar.css';
import test from '../../assets/test.jpg';

function RightSidebar() {
  return (
    <div className="right-sidebar">
      <div className="rs-card">
        <div className="rs-header">
          <h3>Suggested for You</h3>
          <span className="rs-more"></span>
        </div>
        <div className="rs-users">
          <div className="rs-user">
            <img src={test} alt="user" />
            <div className="rs-user-info">
              <h4>David.K.Styles</h4>
              <p>Followed by Elena.V</p>
            </div>
            <button className="rs-follow-btn">Follow</button>
          </div>
          <div className="rs-user">
            <img src={test} alt="user" />
            <div className="rs-user-info">
              <h4>Luna_Aesthetics</h4>
              <p>New on Curated</p>
            </div>
            <button className="rs-follow-btn">Follow</button>
          </div>
          <div className="rs-user">
            <img src={test} alt="user" />
            <div className="rs-user-info">
              <h4>StreetVibe_NYC</h4>
              <p>Trending Creator</p>
            </div>
            <button className="rs-follow-btn">Follow</button>
          </div>
        </div>
      </div>

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
        <p>© 2025 Curated Canvas</p>
      </div>
    </div>
  );
}

export default RightSidebar;
