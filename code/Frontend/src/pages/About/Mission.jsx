import React, { useEffect, useState } from "react";
import "./About.css";

function Mission() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`about-page ${isVisible ? "animate-in" : ""}`}>
      <div className="about-hero mission-hero">
        <h1>Our Mission</h1>
        <p>Driving impact-led commerce globally.</p>
      </div>

      <div className="about-content">
        <div className="mission-grid">
          <div className="mission-card slide-up delay-1">
            <div className="mission-icon">🌍</div>
            <h3>Global Impact</h3>
            <p>
              Connecting local communities with global resources to solve
              pressing challenges such as education, healthcare, and
              environmental conservation.
            </p>
          </div>

          <div className="mission-card slide-up delay-2">
            <div className="mission-icon">🤝</div>
            <h3>Empowering Connections</h3>
            <p>
              Fostering powerful partnerships between socially-conscious brands
              and dedicated charitable organizations to amplify their reach and
              impact.
            </p>
          </div>

          <div className="mission-card slide-up delay-3">
            <div className="mission-icon">♻️</div>
            <h3>Sustainable Commerce</h3>
            <p>
              Promoting eco-friendly and ethically sourced merchandise, ensuring
              that the products you love also care for the planet we live on.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mission;
