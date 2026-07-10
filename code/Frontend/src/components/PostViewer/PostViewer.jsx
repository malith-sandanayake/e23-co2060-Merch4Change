import React, { useState, useEffect } from 'react';
import './PostViewer.css';
import { X, ChevronLeft, ChevronRight, Heart, Share2, MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../../context/Context';
import { likePost, commentOnPost } from '../../api/postsService';

function PostViewer({ post, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user: currentUser } = useAuth();
  
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [localComments, setLocalComments] = useState([]);
  const [localLikes, setLocalLikes] = useState([]);

  useEffect(() => {
    if (post) {
      setLocalComments(post.comments || []);
      setLocalLikes(post.likes || []);
    }
  }, [post]);

  if (!post) return null;

  const isLiked = localLikes.includes(currentUser?._id);


  const images = post.images && post.images.length > 0 ? post.images : (post.imageUrl ? [post.imageUrl] : []);

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

  const handleLike = async () => {
    if (!currentUser || isLiking) return;
    setIsLiking(true);
    try {
      const res = await likePost(post.id || post._id);
      if (res.data?.success) {
        setLocalLikes(res.data.likes);
      }
    } catch (err) {
      console.error('Error liking post:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await commentOnPost(post.id || post._id, commentText);
      if (res.data?.success) {
        setLocalComments(res.data.comments);
        setCommentText('');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
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
            <h4 className="pv-comments-title">Comments ({localComments.length})</h4>
            <div className="pv-comments-list">
              {localComments.length > 0 ? (
                localComments.map((comment, index) => {
                  const authorName = comment.author?.userName || comment.author?.firstName || 'User';
                  const authorImg = comment.author?.profileImageUrl || '/src/assets/user.svg';
                  return (
                    <div key={index} className="pv-comment">
                      <img src={authorImg} alt="author" className="pv-comment-avatar" />
                      <div className="pv-comment-body">
                        <span className="pv-comment-author">@{authorName}</span>
                        <span className="pv-comment-text">{comment.text}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="pv-no-comments">No comments yet. Be the first!</div>
              )}
            </div>
          </div>

          <div className="pv-footer">
            <div className="pv-actions">
              <button className={`pv-action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike} disabled={isLiking}>
                <Heart size={24} fill={isLiked ? "#e91e63" : "none"} color={isLiked ? "#e91e63" : "currentColor"} />
                <span>{localLikes.length}</span>
              </button>
              <button className="pv-action-btn">
                <MessageCircle size={24} />
                <span>{localComments.length}</span>
              </button>
              <button className="pv-action-btn" onClick={handleShare}>
                <Share2 size={24} />
              </button>
            </div>
            <form className="pv-comment-input-form" onSubmit={handleCommentSubmit}>
              <input 
                type="text" 
                placeholder="Add a comment..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isSubmitting}
                className="pv-comment-input"
              />
              <button type="submit" disabled={!commentText.trim() || isSubmitting} className="pv-comment-submit-btn">
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostViewer;
