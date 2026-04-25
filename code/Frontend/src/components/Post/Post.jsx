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
        <button className="post-more-btn">
          <span>•••</span>
        </button>
      </div>

      <div className="post-description">
        <p>The morning light in Milan just hits different. Obsessed with these new linen textures from the Summer Archive. 🇮🇹✨ #LuminousStyle #MilanFashion</p>
      </div>

      <div className="post-image-grid">
        <div className="main-image">
          {/* placeholder for 3D model image */}
        </div>
        <div className="side-images">
          <div className="side-image top-side">
            {/* placeholder for blue item */}
          </div>
          <div className="side-image bottom-side">
            {/* placeholder for shirt item */}
            <div className="image-overlay">+4 items</div>
          </div>
        </div>
      </div>

      <div className="post-footer">
        <div className="post-actions">
          <button onClick={() => setLike(!like)} className="action-btn">
            {like ? (
              <img src={redheart} alt="liked" className="action-icon" />
            ) : (
              <img src={heart} alt="like" className="action-icon" />
            )}
            <span>1.2k</span>
          </button>
          
          <button className="action-btn">
            <img src={comments} alt="comment" className="action-icon" />
            <span>84</span>
          </button>
          
          <button className="action-btn">
            <img src={share} alt="share" className="action-icon" />
          </button>
        </div>
        
        <button className="shop-look-btn">
          Shop Look
        </button>
      </div>
    </div>
  );
}

export default Post;
