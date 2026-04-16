import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result?.success) {
        localStorage.setItem("token", result.data.token);
        const username =
          result?.data?.user?.fullName || result?.data?.user?.email || "me";
        navigate(`/profile/${encodeURIComponent(username)}`);
        return;
      }

      setErrorMsg(result?.message || "Login failed");
    } catch {
      setErrorMsg("Unable to connect to server");
    }
  };

  return (
    <div className="login-container">
      {/* ── Left hero panel ── */}
      <div className="login-hero-panel">
        {/* Decorative blobs */}
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
        <div className="login-blob login-blob-3" />

        <div className="login-hero-content">
          <div className="login-hero-logo">🌿</div>
          <h2 className="login-hero-title">
            Welcome back to
            <br />
            Merch4Change
          </h2>
          <p className="login-hero-subtitle">
            Connect with purpose-driven brands, discover impactful products, and
            make every purchase count.
          </p>
          <div className="login-hero-badges">
            <span className="login-hero-badge">🛍️ Shop</span>
            <span className="login-hero-badge">🤝 Connect</span>
            <span className="login-hero-badge">🌱 Impact</span>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="login-form-panel">
        <div className="login-form-wrapper">
          <div className="login-brand-mark">M</div>

          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue your journey</p>

          {errorMsg && (
            <div className="form-alert error-alert">
              <span>⚠️</span> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <div className="login-forgot-password">
              <a href="#forgot">Forgot password?</a>
            </div>

            <button type="submit" className="login-submit-btn">
              Sign In
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button className="login-google-btn" type="button">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.9700 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
                fill="#4285F4"
              />
              <path
                d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
                fill="#34A853"
              />
              <path
                d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="login-signup-prompt">
            Don&apos;t have an account?{" "}
            <span onClick={() => navigate("/signup")} className="signup-link">
              Sign up here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
