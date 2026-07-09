import React, { useState } from 'react';
import './PostViewer.css';
import { X, ChevronLeft, ChevronRight, Heart, Share2, MessageCircle } from 'lucide-react';

function PostViewer({ post, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!post) return null;

  const images = post.images && post.images.length > 0 ? post.images : (post.imageUrl ? [post.imageUrl] : []);
  const comments = post.comments || [];

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const handleLike = () => {
    alert("Like button clicked! (Backend integration pending)");
  };

  const handleShare = () => {
    alert("Share button clicked! (Backend integration pending)");
  };

  return (
    <div className="pv-overlay" onClick={onClose}>
      <button className="pv-close-btn" onClick={onClose}>
        <X size={24} />
      </button>

      <div className="pv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pv-left-pane">
          {images.length > 0 ? (
            <div className="pv-image-container">
              <img src={images[currentImageIndex]} alt={`Post image ${currentImageIndex + 1}`} className="pv-image" />
              {images.length > 1 && (
                <>
                  {currentImageIndex > 0 && (
                    <button className="pv-arrow pv-arrow-left" onClick={handlePrevImage}>
                      <ChevronLeft size={28} />
                    </button>
                  )}
                  {currentImageIndex < images.length - 1 && (
                    <button className="pv-arrow pv-arrow-right" onClick={handleNextImage}>
                      <ChevronRight size={28} />
                    </button>
                  )}
                  <div className="pv-image-indicators">
                    {images.map((_, idx) => (
                      <span key={idx} className={`pv-indicator ${idx === currentImageIndex ? 'active' : ''}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="pv-no-image">No Image</div>
          )}
        </div>

        <div className="pv-right-pane">
          <div className="pv-header">
            {post.author && (
              <div className="pv-author">
                <img src={post.author.profileImageUrl || '/src/assets/user.svg'} alt="Author" className="pv-author-img" />
                <div className="pv-author-info">
                  <span className="pv-author-name">{post.author.firstName} {post.author.lastName}</span>
                  <span className="pv-author-username">@{post.author.userName}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pv-content">
            <p className="pv-description">{post.description}</p>
          </div>

          <div className="pv-comments-section">
            <h4 className="pv-comments-title">Comments ({comments.length})</h4>
            <div className="pv-comments-list">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="pv-comment">
                    <span className="pv-comment-author">User {comment.author?.substring(0, 4) || 'Unknown'}</span>
                    <span className="pv-comment-text">{comment.text}</span>
                  </div>
                ))
              ) : (
                <div className="pv-no-comments">No comments yet.</div>
              )}
            </div>
          </div>

          <div className="pv-footer">
            <div className="pv-actions">
              <button className="pv-action-btn" onClick={handleLike}>
                <Heart size={24} />
                <span>{post.likesCount || 0}</span>
              </button>
              <button className="pv-action-btn">
                <MessageCircle size={24} />
                <span>{post.commentsCount || 0}</span>
              </button>
              <button className="pv-action-btn" onClick={handleShare}>
                <Share2 size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostViewer;
