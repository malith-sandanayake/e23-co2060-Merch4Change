import React from "react";

export function HeroSection({ heroProduct, onBuy, checkingOut, coinsFor }) {
  return (
    <div className="mk-hero">
      {heroProduct.imageUrl && <img src={heroProduct.imageUrl} alt={heroProduct.name} className="mk-hero-bg" />}
      <div className="mk-hero-overlay" />
      <div className="mk-hero-content">
        <div className="mk-hero-left">
          <div className="mk-hero-tag">
            <span className="mk-hero-dot" />
            {heroProduct.isLimitedEdition ? "LIMITED DROP" : "FEATURED DROP"}
          </div>
          <h1 className="mk-hero-title">{heroProduct.name}</h1>
          <p className="mk-hero-sub">{heroProduct.description}</p>
          <div className="mk-hero-actions">
            <button
              className="mk-hero-buy"
              onClick={() => onBuy(heroProduct)}
              disabled={heroProduct.stock === 0 || checkingOut === heroProduct._id}
            >
              {checkingOut === heroProduct._id ? "Processing..." : "🛒 Buy Now"}
            </button>
            <span className="mk-hero-price">${heroProduct.price?.toLocaleString()}</span>
            <span className="mk-hero-coins">🪙 +{coinsFor(heroProduct.price)} coins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
