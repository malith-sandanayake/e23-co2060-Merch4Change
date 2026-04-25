import React from 'react';
import './RightSidebar.css';
import test from '../../assets/test.jpg';

function RightSidebar({ page = "home" }) {
  if (page === "profile") {
    return (
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
