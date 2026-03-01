import { useEffect, useRef, useState } from "react"
import "./Post.css"
import test from "../../assets/test.jpg"
import postImage from "../../assets/icon.png"

function Post() {
  const postRef = useRef(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    let timer

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            setShowDetails(true)
          }, 1000)   // 1 second stop → show details
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
        <button>❤️ Like</button>
        <button>💬 Comment</button>
        <button>↗ Share</button>
      </div>

    </div>
  )
}

export default Post