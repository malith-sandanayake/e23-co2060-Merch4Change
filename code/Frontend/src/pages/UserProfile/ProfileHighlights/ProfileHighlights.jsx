import React from 'react';
import './ProfileHighlights.css';

function ProfileHighlights() {
  return (
    <>
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
    </>
  );
}

export default ProfileHighlights;
