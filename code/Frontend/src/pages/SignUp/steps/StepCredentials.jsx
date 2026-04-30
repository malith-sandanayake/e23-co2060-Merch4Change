import React, { useEffect, useState } from 'react';

const USERNAME_FORMAT = /^[a-zA-Z0-9._-]{2,30}$/;

const buildLocalSuggestions = (userName) => {
  const normalized = String(userName ?? '').trim().toLowerCase();
  const compact = normalized.replace(/[^a-z0-9._-]/g, '').replace(/^[._-]+|[._-]+$/g, '');
  const base = compact || 'user';

  return [...new Set([
    `${base}1`,
    `${base}_1`,
    `${base}.1`,
    `${base}01`,
    `${base}2026`,
  ])]
    .filter((candidate) => USERNAME_FORMAT.test(candidate))
    .slice(0, 3);
};

function getStrength(password) {
  if (!password) return 0;
  const hasUpper   = /[A-Z]/.test(password);
  const hasLower   = /[a-z]/.test(password);
  const hasNumber  = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const longEnough = password.length >= 8;
  const veryLong   = password.length >= 12;
  if (!longEnough) return 1;
  if (longEnough && hasUpper && hasLower && hasNumber && hasSpecial && veryLong) return 3;
  if (longEnough && (hasUpper || hasLower) && (hasNumber || hasSpecial)) return 2;
  return 1;
}

const STRENGTH_LABEL = { 1:'Weak', 2:'Fair', 3:'Strong' };
const STRENGTH_CLASS = { 1:'weak', 2:'fair', 3:'strong' };

export default function StepCredentials({ formData, onChange, onNext, onBack }) {
  const [showPw,  setShowPw]  = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [usernameState, setUsernameState] = useState({
    status: 'idle',
    message: '',
    suggestions: [],
  });

  const strength = getStrength(formData.password);

  useEffect(() => {
    const trimmedUserName = formData.username.trim();

    if (!trimmedUserName) {
      setUsernameState({
        status: 'idle',
        message: '',
        suggestions: [],
      });
      return undefined;
    }

    if (!USERNAME_FORMAT.test(trimmedUserName)) {
      setUsernameState({
        status: 'invalid',
        message: 'Use 2-30 letters, numbers, dots, underscores, or hyphens.',
        suggestions: [],
      });
      return undefined;
    }

    let isActive = true;
    const controller = new AbortController();

    setUsernameState((prev) => ({
      ...prev,
      status: 'checking',
      message: 'Checking username...',
      suggestions: [],
    }));

    const timer = window.setTimeout(async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(
          `${apiBaseUrl}/api/v1/auth/username-availability?userName=${encodeURIComponent(trimmedUserName)}`,
          { signal: controller.signal },
        );
        const data = await response.json();

        if (!isActive) {
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to validate username.');
        }

        if (data?.data?.available) {
          setUsernameState({
            status: 'available',
            message: 'Username is available.',
            suggestions: [],
          });
          return;
        }

        setUsernameState({
          status: 'taken',
          message: 'Username is taken.',
          suggestions: data?.data?.suggestions?.length ? data.data.suggestions : buildLocalSuggestions(trimmedUserName),
        });
      } catch {
        if (!isActive || controller.signal.aborted) {
          return;
        }

        setUsernameState({
          status: 'error',
          message: 'Unable to check username right now.',
          suggestions: buildLocalSuggestions(trimmedUserName),
        });
      }
    }, 350);

    return () => {
      isActive = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [formData.username]);

  const handleSuggestionSelect = (suggestion) => {
    onChange('username', suggestion);
  };

  const isValid =
    formData.email.trim() !== '' &&
    formData.username.trim() !== '' &&
    usernameState.status === 'available' &&
    formData.password.length >= 8 &&
    /[A-Z]/.test(formData.password) &&
    /[a-z]/.test(formData.password) &&
    /[0-9]/.test(formData.password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) &&
    formData.password === formData.confirmPassword;

  const EyeIcon = ({ show }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      {show
        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/></>
      }
    </svg>
  );

  return (
    <div>
      <button className="signup-back" onClick={onBack}>← Back</button>
      <p className="signup-eyebrow">Step 2 of 3</p>
      <h1 className="signup-title">Set your credentials</h1>
      <p className="signup-subtitle">You'll use these to log in each time.</p>

      <div className="signup-field">
        <label className="signup-label">Email address</label>
        <input className="signup-input" type="email" placeholder="you@example.com"
          value={formData.email} onChange={e => onChange('email', e.target.value)} />
      </div>

      <div className="signup-field">
        <label className="signup-label">Username</label>
        <div className="signup-input-adornment">
          <span className="adornment-prefix">@</span>
          <input className="signup-input has-status" type="text" placeholder="yourhandle"
            value={formData.username} onChange={e => onChange('username', e.target.value)} />
          <div className="username-status" aria-live="polite">
            {usernameState.status === 'checking' ? (
              <span className="username-spinner" aria-label="Checking username" />
            ) : usernameState.status === 'available' ? (
              <span className="username-status-icon username-status-icon--available" aria-label="Username available">✓</span>
            ) : usernameState.status === 'taken' || usernameState.status === 'invalid' || usernameState.status === 'error' ? (
              <span className="username-status-icon username-status-icon--unavailable" aria-label="Username unavailable">✕</span>
            ) : null}
          </div>
          {formData.username.trim() && (usernameState.status === 'taken' || usernameState.status === 'error') && usernameState.suggestions.length > 0 && (
            <div className="username-suggestions">
              <span className="username-suggestions-label">Try:</span>
              <div className="username-suggestions-list">
                {usernameState.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="username-suggestion"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {usernameState.message && formData.username.trim() && (
          <div className={`username-help username-help--${usernameState.status}`}>
            {usernameState.message}
          </div>
        )}
      </div>

      <div className="signup-field">
        <label className="signup-label">Password</label>
        <div className="signup-input-adornment">
          <input className="signup-input has-suffix" type={showPw ? 'text' : 'password'}
            placeholder="Min. 8 chars, upper, lower, number, special"
            value={formData.password} onChange={e => onChange('password', e.target.value)} />
          <button type="button" className="adornment-suffix" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
            <EyeIcon show={showPw} />
          </button>
        </div>
        {formData.password && (
          <>
            <div className="strength-bar">
              <div className={`strength-segment${strength >= 1 ? ` ${STRENGTH_CLASS[strength]}` : ''}`} />
              <div className={`strength-segment${strength >= 2 ? ` ${STRENGTH_CLASS[strength]}` : ''}`} />
              <div className={`strength-segment${strength >= 3 ? ` ${STRENGTH_CLASS[strength]}` : ''}`} />
            </div>
            <div className={`strength-label ${STRENGTH_CLASS[strength]}`}>
              {STRENGTH_LABEL[strength]}
            </div>
          </>
        )}
      </div>

      <div className="signup-field">
        <label className="signup-label">Confirm password</label>
        <div className="signup-input-adornment">
          <input className="signup-input has-suffix" type={showCpw ? 'text' : 'password'}
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={e => onChange('confirmPassword', e.target.value)}
            style={formData.confirmPassword && formData.confirmPassword !== formData.password
              ? { borderColor: '#e24b4a' } : {}} />
          <button type="button" className="adornment-suffix" onClick={() => setShowCpw(v => !v)} tabIndex={-1}>
            <EyeIcon show={showCpw} />
          </button>
        </div>
        {formData.confirmPassword && formData.confirmPassword !== formData.password && (
          <div style={{ color:'#e24b4a', fontSize:12, marginTop:5 }}>Passwords don't match</div>
        )}
      </div>

      <button className="signup-btn" onClick={onNext} disabled={!isValid} style={{ marginTop:8 }}>
        Continue
      </button>
    </div>
  );
}
