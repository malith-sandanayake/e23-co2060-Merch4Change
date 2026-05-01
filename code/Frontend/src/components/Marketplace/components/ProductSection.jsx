import React from "react";
import { ProductCard } from "./ProductCard";

export function ProductSection({ title, icon, products, onBuy, checkingOut, startIndex, coinsFor }) {
  if (products.length === 0) return null;
  return (
    <div className="mk-section">
      <div className="mk-section-header">
        <span className="mk-section-icon">{icon}</span>
        <h3 className="mk-section-title">{title}</h3>
        <span className="mk-section-count">{products.length} items</span>
      </div>
      <div className="mk-grid">
        {products.map((product, i) => (
          <ProductCard
            key={product._id}
            product={product}
            index={startIndex + i}
            onBuy={onBuy}
            isBuying={checkingOut === product._id}
            coinsFor={coinsFor}
          />
        ))}
      </div>
    </div>
  );
}
