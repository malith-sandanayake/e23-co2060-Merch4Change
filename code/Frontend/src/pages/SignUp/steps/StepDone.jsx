import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StepDone() {
  const navigate = useNavigate();

  return (
    <div className="step-done-content">
      <div className="done-checkmark">
        <svg viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 className="done-title">Welcome to Merch4Change</h1>
      <p className="done-subtitle">
        Your account has been created.<br />Let's get started.
      </p>
      <button className="signup-btn" onClick={() => navigate('/home')} style={{ maxWidth:320 }}>
        Go to my dashboard
      </button>
      <div className="signup-footer-link" style={{ marginTop:16 }}>
        <span style={{ color:'#bbb', cursor:'pointer', fontSize:13 }} onClick={() => navigate('/home')}>
          Complete your profile later
        </span>
      </div>
    </div>
  );
}
