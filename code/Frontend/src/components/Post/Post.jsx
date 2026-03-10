import { useEffect, useRef, useState } from "react"
import "./Post.css"
import test from "../../assets/test.jpg"
import postImage from "../../assets/icon.png"
import shop from "../../assets/post_icons/shop.svg"
import heart from "../../assets/post_icons/heart.svg"
import redheart from "../../assets/post_icons/red-heart.svg"
import comments from "../../assets/post_icons/comments.svg"
import share from "../../assets/post_icons/share.svg"
import ShopPopUp from "../ShopPopUp/ShopPopUp"

function Post() {
  const postRef = useRef(null);
  const [showDetails, setShowDetails] = useState(false);
  const [like, setLike] = useState(false);
  const [shopPopUp, setShopPopUp] = useState(false);

  useEffect(() => {
    let timer

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            setShowDetails(true)
          }, 3000)   // 3 second stop → show details
        } else {
          clearTimeout(timer)
          setShowDetails(false)
        }
      },
      { threshold: 0.6 }  // 60% visible
    )

    if (postRef.current) observer.observe(postRef.current)

    return () => {
      clearTimeout(timer)
      if (postRef.current) observer.unobserve(postRef.current)
    }
  }, [])

  return (
    <div className="post" ref={postRef}>

      <div className="post-header">
        <img src={test} alt="user" />
        <div>
          <h4>Renzo</h4>
          <span>2h ago</span>
        </div>
      </div>

      <div className="post-content">
        <img src={postImage} alt="social-media-post" className="post-image" />
        Building my React social media app 🚀🔥
      </div>

      <div className={`product-details ${showDetails ? "active" : ""}`}>
        <div className="product-detail-header">
          <p>This item will be great</p>
        </div>

        {showDetails && (
          <h4 className="see-details">See details</h4>
        )}
      </div>

      <div className="post-actions">
        <div className="post-icons">
          <button onClick={() => setShopPopUp(!shopPopUp)}><img src={shop} alt="shop" className="post-svgs" /></button>
        </div>

        {shopPopUp ? <ShopPopUp onClose={() => setShopPopUp(false)} /> : <></>}

        <div className="post-icons">
          <button onClick={() => setLike(!like)}>
            {like ? (
              <img src={redheart} alt="red-heart-icon" className="post-svgs" />
            ) : (
              <img src={heart} alt="heart-icon" className="post-svgs" />
            )}
          </button>
          <p className="count">0</p>
        </div>

        <div className="post-icons">
          <button><img src={comments} alt="comment-icon" className="post-svgs" /></button>
          <p className="count">0</p>
        </div>

        <div className="post-icons">
          <button><img src={share} alt="share-icon" className="post-svgs" /></button>
        </div>
      </div>

    </div>

  )
}

export default Post