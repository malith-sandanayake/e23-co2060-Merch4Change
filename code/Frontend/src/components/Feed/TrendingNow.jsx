import "./TrendingNow.css";

function TrendingNow() {
  return (
    <div className="trending-now">
      <div className="trending-header">
        <h3>Trending Now</h3>
        <a href="#">View All</a>
      </div>
      <div className="trending-items">
        <div className="trending-card">
          <div className="trending-img placeholder-img-1">
            <span className="trending-tag">#1 Trending</span>
          </div>
          <div className="trending-info">
            <h4>Air-Flow Velocity Red</h4>
            <div className="price-rating">
              <span className="price">$189.00</span>
              <span className="rating">⭐ 4.9 (2.1k)</span>
            </div>
          </div>
        </div>
        <div className="trending-card">
          <div className="trending-img placeholder-img-2">
            <span className="trending-tag staff-pick">Staff Pick</span>
          </div>
          <div className="trending-info">
            <h4>Nexus Pro Smartwatch</h4>
            <div className="price-rating">
              <span className="price">$299.00</span>
              <span className="rating">⭐ 4.8 (856)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrendingNow;
