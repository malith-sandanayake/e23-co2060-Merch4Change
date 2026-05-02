import React from "react";
import { Heart } from "lucide-react";

function EmptyState({ onDonateClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <Heart size={64} color="#E2DAD0" className="mb-6" />
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "24px",
          color: "#1A1A1A",
          marginBottom: "12px",
        }}
      >
        No donations yet
      </h2>
      <p
        className="max-w-[360px] mx-auto"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "15px",
          color: "#6B6560",
          marginBottom: "32px",
          lineHeight: 1.5,
        }}
      >
        Your giving history will appear here. Make your first donation and start making a difference.
      </p>
      <button
        onClick={onDonateClick}
        className="transition-colors cursor-pointer"
        style={{
          backgroundColor: "#D4820A",
          color: "#FFFFFF",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          padding: "12px 24px",
          borderRadius: "10px",
          border: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#be7509")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#D4820A")}
      >
        Make Your First Donation
      </button>
    </div>
  );
}

export default EmptyState;
