import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserSignupPage.css";

function UserSignupPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    // 1. Basic Frontend Validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrorMsg(passwordError);
      return;
    }

    // 2. Deployment-ready URL (Vercel will use the Env Var, Local will use 5000)
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
          userName: formData.userName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          accountType: "individual", // MATCHES BACKEND ENUM
        }),
      });

      const data = await response.json();

      // 3. Handle Standardized Backend Errors (apiResponse.js format)
      if (!response.ok || !data.success) {
        let message = data.message || "Signup failed.";
        
        // If the backend validateRequest middleware returned specific field errors
        if (data.error?.details && Array.isArray(data.error.details)) {
          const detailMsgs = data.error.details.map((d) => d.message).join(" | ");
          message = `${message}: ${detailMsgs}`;
        }
        
        setErrorMsg(message);
        return;
      }

      // 4. Handle Success
      if (data?.data?.token) {
        localStorage.setItem("token", data.data.token);
        // Optional: store basic user info
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      setSuccessMsg("Account created successfully! Redirecting...");
      
      // Reset form
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

    } catch (err) {
      console.error("Signup Network Error:", err);
      setErrorMsg("Unable to connect to the server. Please check your internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="user-signup-outer">
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
            <li><span>🛍️</span> Buy &amp; sell impact products</li>
            <li><span>🎁</span> Donate items to causes</li>
            <li><span>🏆</span> Earn ranks &amp; rewards</li>
            <li><span>🌱</span> Follow your favourite orgs</li>
          </ul>
        </div>
      </div>

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

            <div className="user-form-group full-width">
              <label>Username</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                placeholder="e.g. johndoe42"
              />
            </div>

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

            <div className="user-form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
              />
            </div>

            <div className="user-form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm"
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