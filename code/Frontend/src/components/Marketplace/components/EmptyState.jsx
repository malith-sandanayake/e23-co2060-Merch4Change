import React from "react";

export function EmptyState({ filter }) {
  return (
    <div className="mk-empty">
      <span className="mk-empty-icon">🛍️</span>
      <h3>No products found</h3>
      <p>{filter !== "All" ? "Try switching to All." : "Check back soon."}</p>
    </div>
  );
}
