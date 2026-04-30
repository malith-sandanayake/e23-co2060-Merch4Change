import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./UserSignupPage.css";

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

function UserSignupPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameState, setUsernameState] = useState({
    status: "idle",
    message: "",
    suggestions: [],
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const trimmedUserName = formData.userName.trim();

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
          {
            signal: controller.signal,
          },
        );
        const data = await response.json();

        if (!isActive) {
          return;
        }

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
        if (!isActive || controller.signal.aborted) {
          return;
        }

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuggestionSelect = (suggestion) => {
    setFormData((prev) => ({ ...prev, userName: suggestion }));
    setErrorMsg("");
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("at least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("one special character");
    
    if (errors.length > 0) {
      return "Password must contain " + errors.join(", ") + ".";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (usernameState.status === "checking") {
      setErrorMsg("Please wait while we verify your username.");
      return;
    }

    if (usernameState.status === "invalid") {
      setErrorMsg(usernameState.message || "Enter a valid username.");
      return;
    }

    if (usernameState.status === "taken") {
      setErrorMsg("Username is already taken. Choose one of the suggestions.");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrorMsg(passwordError);
      return;
    }

    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      setIsSubmitting(true);

      const response = await fetch(`${apiBaseUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          fullName,
          userName: formData.userName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          accountType: "user",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.message || "Signup failed. Please try again.");
        return;
      }

      if (data?.data?.token) {
        localStorage.setItem("token", data.data.token);
      }

      setSuccessMsg("User account created successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="user-signup-outer">
      {/* Left hero panel */}
      <div className="user-signup-hero">
        <div className="user-blob user-blob-1" />
        <div className="user-blob user-blob-2" />
        <div className="user-blob user-blob-3" />
        <div className="user-hero-content">
          <div className="user-hero-logo">👤</div>
          <h2 className="user-hero-title">
            Join as a<br />
            User
          </h2>
          <p className="user-hero-subtitle">
            Shop with purpose, support causes you care about, and rank up as you
            make an impact.
          </p>
          <ul className="user-hero-features">
            <li>
              <span>🛍️</span> Buy &amp; sell impact products
            </li>
            <li>
              <span>🎁</span> Donate items to causes
            </li>
            <li>
              <span>🏆</span> Earn ranks &amp; rewards
            </li>
            <li>
              <span>🌱</span> Follow your favourite orgs
            </li>
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="user-signup-form-panel">
        <div className="user-signup-form-container">
          <div className="user-brand-mark">🌿</div>

          <h1>Create Your Account</h1>
          <p className="user-form-subtitle">It's free and always will be</p>

          {errorMsg && (
            <div className="form-alert error-alert">
              <span>⚠️</span> {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="form-alert success-alert">
              <span>✅</span> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="user-form">
            {/* First & Last name */}
            <div className="user-form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="John"
              />
            </div>

            <div className="user-form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Doe"
              />
            </div>

            {/* Username – full width */}
            <div className="user-form-group full-width">
              <label>Username</label>
              <div className="user-input-shell">
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. johndoe42"
                  autoComplete="off"
                  aria-describedby="username-status"
                />
                <div className="user-username-status" id="username-status" aria-live="polite">
                  {usernameState.status === "checking" ? (
                    <span className="user-username-spinner" aria-label="Checking username" />
                  ) : usernameState.status === "available" ? (
                    <span className="user-username-status-icon user-username-status-icon--available" aria-label="Username available">
                      ✓
                    </span>
                  ) : usernameState.status === "taken" || usernameState.status === "invalid" || usernameState.status === "error" ? (
                    <span className="user-username-status-icon user-username-status-icon--unavailable" aria-label="Username unavailable">
                      ✕
                    </span>
                  ) : null}
                </div>
                {formData.userName.trim() && (usernameState.status === "taken" || usernameState.status === "error") && usernameState.suggestions.length > 0 && (
                  <div className="user-username-suggestions">
                    <span className="user-username-suggestions-label">Try:</span>
                    <div className="user-username-suggestions-list">
                      {usernameState.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          className="user-username-suggestion"
                          onClick={() => handleSuggestionSelect(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {usernameState.message && formData.userName.trim() && (
                <p className={`user-username-help user-username-help--${usernameState.status}`}>
                  {usernameState.message}
                </p>
              )}
            </div>

            {/* Email – full width */}
            <div className="user-form-group full-width">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="user-form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Upper, lower, number, special & 8 chars min"
              />
            </div>

            {/* Confirm Password */}
            <div className="user-form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter password"
              />
            </div>

            <button
              type="submit"
              className="user-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>

            <p className="user-login-prompt">
              Already have an account?{" "}
              <span
                className="user-login-link"
                onClick={() => navigate("/login")}
              >
                Sign in here
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserSignupPage;