import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StepDone({ charityIntent = false }) {
  const navigate = useNavigate();
  const primaryPath = charityIntent ? '/charity/verify' : '/home';
  const primaryLabel = charityIntent ? 'Verify your organization' : 'Go to my dashboard';

  return (
    <div className="step-done-content">
      <div className="done-checkmark">
        <svg viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 className="done-title">Welcome to Merch4Change</h1>
      <p className="done-subtitle">
        Your account has been created.
        {charityIntent
          ? <><br />Next, submit your organization for verification.</>
          : <><br />Let's get started.</>}
      </p>
      <button className="signup-btn" onClick={() => navigate(primaryPath)} style={{ maxWidth:320 }}>
        {primaryLabel}
      </button>
      <div className="signup-footer-link" style={{ marginTop:16 }}>
        <span
          style={{ color:'#bbb', cursor:'pointer', fontSize:13 }}
          onClick={() => navigate(charityIntent ? '/home' : '/home')}
        >
          {charityIntent ? 'Complete verification later' : 'Complete your profile later'}
        </span>
      </div>
    </div>
  );
}
