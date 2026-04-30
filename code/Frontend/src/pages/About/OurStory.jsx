import React, { useEffect, useState } from "react";
import "./About.css";

function OurStory() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`about-page ${isVisible ? "animate-in" : ""}`}>
      <div className="about-hero story-hero">
        <h1>Our Story</h1>
        <p>How a simple idea grew into a movement for change.</p>
      </div>

      <div className="about-content">
        <div className="content-block slide-up delay-1">
          <h2>The Beginning</h2>
          <p>
            Merch4Change was born out of a desire to bridge the gap between
            impactful charity work and everyday consumerism. We realized that
            people love supporting their favorite brands, but also want to make
            a difference in the world.
          </p>
        </div>

        <div className="content-block slide-up delay-2">
          <h2>Our Vision</h2>
          <p>
            Our goal is to create a seamless platform where every purchase has a
            positive impact. By partnering with leading brands we are developing
            sustainable merchandise lines that directly fund community projects.
          </p>
        </div>

        <div className="content-block slide-up delay-3">
          <h2>The Journey Ahead</h2>
          <p>
            We are constantly expanding our network of charities and brands. Our
            story is just beginning, and we invite you to be a part of it.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OurStory;
