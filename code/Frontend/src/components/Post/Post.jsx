import { useState } from "react";
import "./Post.css";

import test from "../../assets/test.jpg";
import heart from "../../assets/post_icons/heart.svg";
import redheart from "../../assets/post_icons/red-heart.svg";
import comments from "../../assets/post_icons/comments.svg";
import share from "../../assets/post_icons/share.svg";

function Post() {
  const [like, setLike] = useState(false);

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-user-info">
          <img src={test} alt="user" className="post-avatar" />
          <div className="post-meta">
            <h4>Zoe.Studio</h4>
            <span>2 hours ago • Milan, Italy</span>
          </div>
        </div>
        <button type="button" className="post-more-btn" aria-label="More options">
          <span>•••</span>
        </button>
      </div>

      <div className="post-description">
        <p>
          The morning light in Milan just hits different. Obsessed with these new linen textures from the Summer Archive. 🇮🇹✨ #LuminousStyle #MilanFashion
        </p>
      </div>

      <div className="post-image-grid">
        <div className="main-image" />
        <div className="side-images">
          <div className="side-image top-side" />
          <div className="side-image bottom-side">
            <div className="image-overlay">+4 items</div>
          </div>
        </div>
      </div>

      <div className="post-footer">
        <div className="post-actions">
          <button type="button" onClick={() => setLike((current) => !current)} className="action-btn">
            {like ? (
              <img src={redheart} alt="liked" className="action-icon" />
            ) : (
              <img src={heart} alt="like" className="action-icon" />
            )}
            <span>1.2k</span>
          </button>

          <button type="button" className="action-btn">
            <img src={comments} alt="comment" className="action-icon" />
            <span>84</span>
          </button>

          <button type="button" className="action-btn">
            <img src={share} alt="share" className="action-icon" />
          </button>
        </div>

        <button type="button" className="shop-look-btn">
          Shop Look
        </button>
      </div>
    </div>
  );
}

export default Post;
