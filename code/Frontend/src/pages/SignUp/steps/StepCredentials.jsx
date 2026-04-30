import React, { useState, useEffect } from "react";

const USERNAME_FORMAT = /^[a-zA-Z0-9._-]{2,30}$/;

const buildLocalSuggestions = (userName) => {
  const normalized = String(userName ?? "").trim().toLowerCase();
  const compact = normalized.replace(/[^a-z0-9._-]/g, "").replace(/^[._-]+|[._-]+$/g, "");
  const base = compact || "user";

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

function StepCredentials({ formData, onChange, onNext, onBack }) {
  const [showPassword, setShowPassword] = useState(false);
  const [usernameState, setUsernameState] = useState({
    status: "idle",
    message: "",
    suggestions: [],
  });

  const handleChange = (e) => {
    onChange(e.target.name, e.target.value);
  };

  const handleSuggestionSelect = (suggestion) => {
    onChange("userName", suggestion);
  };

  useEffect(() => {
    const trimmedUserName = (formData.userName || "").trim();

    if (!trimmedUserName) {
      setUsernameState({
        status: "idle",
        message: "",
        suggestions: [],
      });
      return undefined;
    }

    if (!USERNAME_FORMAT.test(trimmedUserName)) {
      setUsernameState({
        status: "invalid",
        message: "Use 2-30 letters, numbers, dots, underscores, or hyphens.",
        suggestions: [],
      });
      return undefined;
    }

    let isActive = true;
    const controller = new AbortController();

    setUsernameState((prev) => ({
      ...prev,
      status: "checking",
      message: "Checking username...",
      suggestions: [],
    }));

    const timer = window.setTimeout(async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(
          `${apiBaseUrl}/api/v1/auth/username-availability?userName=${encodeURIComponent(trimmedUserName)}`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (!isActive) return;

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to validate username.");
        }

        if (data?.data?.available) {
          setUsernameState({
            status: "available",
            message: "Username is available.",
            suggestions: [],
          });
          return;
        }

        const suggestions = data?.data?.suggestions?.length
          ? data.data.suggestions
          : buildLocalSuggestions(trimmedUserName);

        setUsernameState({
          status: "taken",
          message: "Username is taken.",
          suggestions,
        });
      } catch {
        if (!isActive || controller.signal.aborted) return;
        setUsernameState({
          status: "error",
          message: "Unable to check username right now.",
          suggestions: buildLocalSuggestions(trimmedUserName),
        });
      }
    }, 350);

    return () => {
      isActive = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [formData.userName]);

  const getPasswordStrength = (password) => {
    if (!password) return "empty";
    if (password.length < 8) return "weak";
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (hasUpper && hasNumber && hasSpecial) return "strong";
    return "fair";
  };

  const strength = getPasswordStrength(formData.password);

  const isNextDisabled = 
    !formData.email || 
    !formData.userName || 
    !formData.password || 
    !formData.confirmPassword ||
    formData.password !== formData.confirmPassword ||
    strength === "weak" ||
    ["checking", "invalid", "taken"].includes(usernameState.status);

  return (
    <>
      <div className="eyebrow">Step 2 of 4</div>
      <h1 className="form-title">Set your credentials</h1>
      <p className="form-subtitle">Keep your account secure.</p>

      <div className="field">
        <label>Email address</label>
        <input type="email" name="email" value={formData.email || ""} onChange={handleChange} />
      </div>

      <div className="field">
        <label>Username</label>
        <div className="username-shell">
          <span className="username-prefix">@</span>
          <input
            type="text"
            name="userName"
            value={formData.userName || ""}
            onChange={handleChange}
            className="username-input"
          />
          {usernameState.status === "checking" && <span className="username-spinner"></span>}
          {usernameState.status === "available" && <span className="username-status-icon available">✓</span>}
          {["taken", "invalid", "error"].includes(usernameState.status) && <span className="username-status-icon taken">✕</span>}
        </div>
        
        {usernameState.message && (
          <div className={`username-help ${usernameState.status}`}>
            {usernameState.message}
          </div>
        )}

        {(usernameState.status === "taken" || usernameState.status === "error") && usernameState.suggestions.length > 0 && (
          <div className="username-suggestions">
            {usernameState.suggestions.map((suggestion) => (
              <span
                key={suggestion}
                className="username-suggestion-pill"
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                {suggestion}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="field">
        <label>Password</label>
        <div className="password-shell">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
          />
          <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            )}
          </button>
        </div>
        {formData.password && (
          <>
            <div className="strength-bar">
              <div className={`strength-segment ${strength === "weak" || strength === "fair" || strength === "strong" ? strength : ""}`}></div>
              <div className={`strength-segment ${strength === "fair" || strength === "strong" ? strength : ""}`}></div>
              <div className={`strength-segment ${strength === "strong" ? strength : ""}`}></div>
            </div>
            <div className={`strength-label ${strength}`}>
              {strength.charAt(0).toUpperCase() + strength.slice(1)}
            </div>
          </>
        )}
      </div>

      <div className="field">
        <label>Confirm password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword || ""}
          onChange={handleChange}
        />
      </div>

      <button className="btn-primary" onClick={onNext} disabled={isNextDisabled}>
        Continue
      </button>
      <button className="btn-back" onClick={onBack}>
        Back
      </button>
    </>
  );
}

export default StepCredentials;
