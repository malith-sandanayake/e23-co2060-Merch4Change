import React from 'react';
import './PostGrid.css';

function formatCreatedAt(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PostGrid({ posts = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="lum-post-grid lum-post-grid--empty">
        <div className="lum-post-empty">
          <h3>Loading posts...</h3>
          <p>Fetching the latest posts for this profile.</p>
        </div>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="lum-post-grid lum-post-grid--empty">
        <div className="lum-post-empty">
          <h3>No posts yet</h3>
          <p>When you share updates, they will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lum-post-grid">
      {posts.map((post) => (
        <div className="lum-post-card" key={post.id || post._id || post.title}>
          <div className={`post-img ${post.imageClassName || ''}`.trim()} style={post.imageUrl ? { backgroundImage: `url(${post.imageUrl})` } : undefined} />
          <div className="post-info">
            <h4>{post.title}</h4>
            {post.description && <p>{post.description}</p>}
            <div className="post-footer">
              {post.likesCount != null && <span>❤ {post.likesCount}</span>}
              {post.commentsCount != null && <span>💬 {post.commentsCount}</span>}
              {post.createdAt && <span className="post-time">{formatCreatedAt(post.createdAt)}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostGrid;
