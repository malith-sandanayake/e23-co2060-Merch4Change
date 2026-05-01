import React from "react";

export function FilterBar({ filter, onFilterChange, filters }) {
  return (
    <div className="mk-filter-bar">
      {filters.map((f) => (
        <button
          key={f}
          className={`mk-filter-pill ${filter === f ? "mk-filter-active" : ""}`}
          onClick={() => onFilterChange(f)}
        >
          {f === "Trending" ? "🔥 Trending" : f === "Limited" ? "⭐ Limited" : f}
        </button>
      ))}
    </div>
  );
}
