import React from 'react';
import { Link } from 'react-router-dom';

export default function StepAccountType({ formData, onChange, onNext }) {
  const selected = formData.accountType;

  return (
    <div>
      <p className="signup-eyebrow">Get started</p>
      <h1 className="signup-title">Choose your account type</h1>
      <p className="signup-subtitle">You can always change this later</p>

      <div className="account-cards">
        <div
          className={`account-card${selected === 'user' ? ' selected' : ''}`}
          onClick={() => onChange('accountType', 'user')}
        >
          <div className="account-card-icon">
            <svg viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
          </div>
          <div className="account-card-title">Individual</div>
          <div className="account-card-desc">Shop, support causes, and follow creators</div>
        </div>

        <div
          className={`account-card${selected === 'org' ? ' selected' : ''}`}
          onClick={() => onChange('accountType', 'org')}
        >
          <div className="account-card-icon">
            <svg viewBox="0 0 24 24"><path d="M12 3L2 9v1h20V9L12 3zM4 12v6H2v2h20v-2h-2v-6h-2v6H6v-6H4zm4 0v6h8v-6H8z"/></svg>
          </div>
          <div className="account-card-title">Organisation</div>
          <div className="account-card-desc">Sell merch, run campaigns, and grow your impact</div>
        </div>
      </div>

      <button className="signup-btn" onClick={onNext} disabled={!selected}>
        Continue
      </button>

      <div className="signup-footer-link">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
}
