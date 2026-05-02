import React from "react";
import { Heart } from "lucide-react";

function ProjectCard({ title, description, goalAmount, collectedAmount, userContribution, onDonateMore }) {
  const progressPercent = goalAmount > 0 ? Math.min(100, Math.floor((collectedAmount / goalAmount) * 100)) : 0;

  return (
    <div
      className="flex flex-col"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2DAD0",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {/* Image Area */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: "180px", backgroundColor: "#F0EBE1" }}
      >
        <div
          className="absolute top-4 left-4"
          style={{
            backgroundColor: "#D4820A",
            color: "#FFFFFF",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: "20px",
          }}
        >
          Ongoing
        </div>
        <Heart size={48} color="#D4820A" opacity={0.5} />
      </div>

      {/* Body */}
      <div style={{ padding: "20px" }}>
        <h3
          className="truncate"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "18px",
            color: "#1A1A1A",
            marginBottom: "4px",
          }}
        >
          {title}
        </h3>
        <p
          className="line-clamp-2"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#6B6560",
            marginBottom: "16px",
            height: "38px",
          }}
        >
          {description}
        </p>

        {/* Progress Section */}
        <div
          className="flex justify-between items-center"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#6B6560" }}
        >
          <span>LKR {collectedAmount.toLocaleString()} raised</span>
          <span>{progressPercent}%</span>
        </div>

        <div
          className="w-full"
          style={{ height: "8px", backgroundColor: "#F0EBE1", borderRadius: "4px", margin: "6px 0" }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              backgroundColor: "#D4820A",
              borderRadius: "4px",
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <div
          className="flex justify-between items-center"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#6B6560" }}
        >
          <span>Goal: LKR {goalAmount.toLocaleString()}</span>
          <span>Ends Dec 2026</span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#E2DAD0" }} />

      {/* Footer */}
      <div className="flex justify-between items-center" style={{ padding: "16px 20px" }}>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#D4820A",
            fontWeight: 500,
          }}
        >
          Your contribution: LKR {userContribution.toLocaleString()}
        </span>
        <button
          onClick={onDonateMore}
          className="hover:underline cursor-pointer bg-transparent border-none p-0 transition-all"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#0D6B5E",
            textDecoration: "none",
          }}
        >
          Donate More &rarr;
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
