import React from "react";
import { useNavigate } from "react-router-dom";
import "./HelpAndSupport.css";

function HelpAndSupport() {
  const navigate = useNavigate();

  return (
    <div className="help-page">
      <div className="help-hero">
        <h1>How can we help you today?</h1>
        <div className="help-search-bar">
          <input
            type="text"
            placeholder="Search for articles, guides or FAQs..."
          />
          <button className="search-btn">Search</button>
        </div>
      </div>

      <div className="help-categories">
        <div className="help-card" onClick={() => navigate("/faq")}>
          <div className="card-icon">📚</div>
          <h3>Getting Started</h3>
          <p>
            Learn the basics of using Merch4Change and creating your account.
          </p>
        </div>

        <div className="help-card" onClick={() => navigate("/faq")}>
          <div className="card-icon">❓</div>
          <h3>FAQs</h3>
          <p>Find answers to the most frequently asked questions.</p>
        </div>

        <div className="help-card" onClick={() => navigate("/help/contact")}>
          <div className="card-icon">✉️</div>
          <h3>Contact Support</h3>
          <p>
            Can't find what you need? Reach out to our dedicated support team.
          </p>
        </div>
      </div>

      <div className="help-guides">
        <h2>Popular Guides</h2>
        <ul className="guide-list">
          <li>How to setup your organization profile</li>
          <li>Connecting with partner brands</li>
          <li>Managing your charity campaigns</li>
          <li>Understanding shipping and delivery</li>
        </ul>
      </div>
    </div>
  );
}

export default HelpAndSupport;
