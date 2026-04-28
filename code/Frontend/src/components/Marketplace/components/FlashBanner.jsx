import React from "react";

export function FlashBanner() {
  return (
    <div className="mk-flash-banner">
      <span className="mk-flash-dot" />
      <span className="mk-flash-text">
        Flash deal — earn <strong>double coins</strong> on orders above $5,000 today only
      </span>
      <span className="mk-flash-end">Ends in 04:22:15</span>
    </div>
  );
}
