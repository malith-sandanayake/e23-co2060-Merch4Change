import { useState } from "react";
import { useIntersectionTimer } from "../../hooks/useIntersectionTimer";
import ActionButton from "./ActionButton";
import ShopPopUp from "../ShopPopUp/ShopPopUp";
import "./Post.css";

// Assets (Keep your existing imports)
import test from "../../assets/test.jpg";
import postImage from "../../assets/icon.png";
import { shop, heart, redheart, comments, share } from "../../assets/post_icons";

function Post({ data }) {
  // 1. Logic handled by custom hook
  const [postRef, showDetails] = useIntersectionTimer(3000);
  
  // 2. Simple UI states
  const [isLiked, setIsLiked] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <div className="post" ref={postRef}>
      <div className="post-header">
        <img src={test} alt="user" />
        <div>
          <h4>{data?.username || "Renzo"}</h4>
          <span>{data?.time || "2h ago"}</span>
        </div>
      </div>

      <div className="post-content">
        <img src={postImage} alt="post" className="post-image" />
        {data?.caption || "Building my React social media app 🚀🔥"}
      </div>

      <div className={`product-details ${showDetails ? "active" : ""}`}>
        <p>This item will be great</p>
        {showDetails && <h4 className="see-details">See details</h4>}
      </div>

      <div className="post-actions">
        <ActionButton 
          icon={shop} 
          onClick={() => setIsShopOpen(true)} 
        />
        
        <ActionButton 
          icon={heart} 
          activeIcon={redheart}
          active={isLiked}
          count={0} 
          onClick={() => setIsLiked(!isLiked)} 
        />

        <ActionButton icon={comments} count={0} />
        <ActionButton icon={share} />

        {isShopOpen && <ShopPopUp onClose={() => setIsShopOpen(false)} />}
      </div>
    </div>
  );
}

export default Post;