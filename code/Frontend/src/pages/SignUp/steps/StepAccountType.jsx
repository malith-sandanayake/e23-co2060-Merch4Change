import React from "react";
import { useNavigate } from "react-router-dom";

function StepAccountType({ formData, onChange, onNext }) {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    onChange("accountType", type);
  };

  return (
    <>
      <div className="eyebrow">Get started</div>
      <h1 className="form-title">Choose your account type</h1>
      <p className="form-subtitle">You can always change this later</p>

      <div className="account-cards">
        <div
          className={`account-card ${formData.accountType === "user" ? "selected" : ""}`}
          onClick={() => handleSelect("user")}
        >
          <div className="account-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="account-card-title">Individual</div>
          <div className="account-card-desc">Shop, support causes, and follow creators</div>
        </div>

        <div
          className={`account-card ${formData.accountType === "org" ? "selected" : ""}`}
          onClick={() => handleSelect("org")}
        >
          <div className="account-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <path d="M9 22v-4h6v4"></path>
              <path d="M8 6h.01"></path>
              <path d="M16 6h.01"></path>
              <path d="M12 6h.01"></path>
              <path d="M12 10h.01"></path>
              <path d="M12 14h.01"></path>
              <path d="M16 10h.01"></path>
              <path d="M16 14h.01"></path>
              <path d="M8 10h.01"></path>
              <path d="M8 14h.01"></path>
            </svg>
          </div>
          <div className="account-card-title">Organisation</div>
          <div className="account-card-desc">Sell merch, run campaigns, and grow your impact</div>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={onNext}
        disabled={!formData.accountType}
      >
        Continue
      </button>

      <div className="signin-row">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Sign in</span>
      </div>
    </>
  );
}

export default StepAccountType;
