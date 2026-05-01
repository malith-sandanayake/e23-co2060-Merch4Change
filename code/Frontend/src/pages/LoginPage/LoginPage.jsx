import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.email.trim() || !formData.password) {
      setErrorMsg("Please enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiBase}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.message || "Invalid email or password.");
        return;
      }

      if (data?.data?.token) {
        if (rememberMe) {
          localStorage.setItem("token", data.data.token);
        } else {
          sessionStorage.setItem("token", data.data.token);
        }
      }

      navigate("/home");
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left panel */}
      <div className="login-left">
        <Link to="/" className="login-brand">
          <div className="login-brand-icon">M</div>
          <span className="login-brand-name">Merch4Change</span>
        </Link>

        <div className="login-hero">
          <h1 className="login-tagline">
            Wear your<br />
            <em>values</em> on<br />
            your sleeve.
          </h1>
          <p className="login-desc">
            Connect with causes, creators, and communities that matter — through
            merchandise that makes a difference.
          </p>
        </div>

        <div className="login-testimonial-wrap">
          <div className="login-testimonial">
            <p className="login-testimonial-text">
              "Merch4Change helped us raise over $12,000 for our local shelter —
              and the products practically sold themselves."
            </p>
            <div className="login-testimonial-author">
              <div className="login-avatar">SR</div>
              <div>
                <div className="login-author-name">Sarah R.</div>
                <div className="login-author-role">NGO founder, Colombo</div>
              </div>
            </div>
          </div>
          <div className="login-dots">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="login-dot" />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-form-wrap">

          <p className="login-eyebrow">Welcome back</p>
          <h2 className="login-title">Sign in to your account</h2>
          <p className="login-subtitle">
            Don't have an account?{" "}
            <Link to="/signup" className="login-link">Sign up free</Link>
          </p>

          {errorMsg && (
            <div className="login-error">{errorMsg}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            <div className="login-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="login-options-row">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="login-forgot">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>

          </form>

          <p className="login-terms">
            By signing in you agree to our{" "}
            <Link to="/terms" className="login-link">Terms</Link>
            {" "}&amp;{" "}
            <Link to="/privacy" className="login-link">Privacy Policy</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;