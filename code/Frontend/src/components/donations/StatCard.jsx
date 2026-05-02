import React from "react";

function StatCard({ number, label, sub }) {
  return (
    <div
      className="relative flex flex-col"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2DAD0",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "4px",
          backgroundColor: "#D4820A",
          borderRadius: "4px 4px 0 0",
        }}
      />
      <div
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "32px",
          color: "#D4820A",
          lineHeight: 1.2,
          marginBottom: "4px",
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          color: "#6B6560",
          marginBottom: "2px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12px",
          color: "#6B6560",
        }}
      >
        {sub}
      </div>
    </div>
  );
}

export default StatCard;
