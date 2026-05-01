import React from "react";

function LoadingSkeleton() {
  const shimmerStyle = {
    background: "linear-gradient(90deg, #F0EBE1 25%, #E2DAD0 50%, #F0EBE1 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  };

  return (
    <div className="w-full">
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: "128px",
              borderRadius: "16px",
              ...shimmerStyle,
            }}
          />
        ))}
      </div>

      {/* Projects Skeleton */}
      <div className="mb-12">
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "24px",
            color: "#1A1A1A",
            marginBottom: "4px",
          }}
        >
          Ongoing Projects
        </h2>
        <div style={{ borderTop: "3px solid #D4820A", width: "48px", marginTop: "6px", marginBottom: "24px" }} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                height: "360px",
                borderRadius: "16px",
                ...shimmerStyle,
              }}
            />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="mb-8">
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "24px",
            color: "#1A1A1A",
            marginBottom: "4px",
          }}
        >
          Donation History
        </h2>
        <div style={{ borderTop: "3px solid #D4820A", width: "48px", marginTop: "6px", marginBottom: "24px" }} />
        <div
          style={{
            border: "1px solid #E2DAD0",
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div style={{ height: "48px", backgroundColor: "#F0EBE1" }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                height: "56px",
                borderBottom: "1px solid #E2DAD0",
                ...shimmerStyle,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;
