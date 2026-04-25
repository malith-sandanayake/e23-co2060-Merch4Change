import React from 'react';
import './PostGrid.css';

function PostGrid() {
  return (
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
  );
}

export default PostGrid;
