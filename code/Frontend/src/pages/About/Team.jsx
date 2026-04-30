import React, { useEffect, useState } from "react";
import "./About.css";

function Team() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamMembers = [
    { name: "", role: "Founder & CEO", icon: "👩‍💼" },
    { name: "Mark Robertson", role: "Head of Partnerships", icon: "👨‍💼" },
    { name: "Aisha Patel", role: "Community Director", icon: "👩‍💻" },
    { name: "David Chen", role: "Lead Developer", icon: "👨‍💻" },
  ];

  return (
    <div className={`about-page ${isVisible ? "animate-in" : ""}`}>
      <div className="about-hero team-hero">
        <h1>Team Antigravity</h1>
        <p>The passionate individuals driving Merch4Change.</p>
      </div>

      <div className="about-content">
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2
            style={{ fontSize: "32px", color: "#10233a", marginBottom: "20px" }}
          >
            🚧 Under Construction 🚧
          </h2>
          <p style={{ fontSize: "18px", color: "#64748b" }}>
            We're currently updating our team profiles. Check back soon to meet
            the minds behind the mission!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;
