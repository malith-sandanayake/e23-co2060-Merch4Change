import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn } from "lucide-react";
import "./GuestBlock.css";

export default function GuestBlock() {
  const navigate = useNavigate();

  return (
    <div className="guest-block-container">
      <div className="guest-block-card">
        <div className="lock-icon-wrap">
          <Lock size={40} />
        </div>
        <h2>Exclusive Marketplace</h2>
        <p>
          Our marketplace is a curated space for our community of changemakers. 
          Please sign in to browse products and support verified causes.
        </p>
        <div className="guest-block-actions">
          <button className="gb-btn-primary" onClick={() => navigate("/login")}>
            <LogIn size={18} /> <span>Sign In</span>
          </button>
          <button className="gb-btn-secondary" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
