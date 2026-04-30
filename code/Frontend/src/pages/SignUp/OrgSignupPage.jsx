import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrgSignupPage.css";

function OrgSignupPage({ onNavigate }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    orgName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    website: "",
    accountType: "organization",
  });

  const [emailStatus, setEmailStatus] = useState({
    status: "idle", // idle, checking, valid, invalid
    message: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Email validation regex - allows standard email formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email) => {
    return emailRegex.test(email.trim());
  };

  // Real-time email validation
  useEffect(() => {
    const trimmedEmail = formData.email.trim();
    console.log("Email value:", trimmedEmail);

    if (!trimmedEmail) {
      setEmailStatus({
        status: "idle",
        message: "",
      });
      return;
    }

    // Check format
    const isValid = validateEmail(trimmedEmail);
    console.log("Email validation result:", isValid, "Regex test:", emailRegex.test(trimmedEmail));

    if (!isValid) {
      setEmailStatus({
        status: "invalid",
        message: "Use a valid email format (e.g., user@example.com)",
      });
      console.log("Email status set to INVALID");
    } else {
      setEmailStatus({
        status: "valid",
        message: "✓ Email format is valid",
      });
      console.log("Email status set to VALID");
    }
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    const passwordError = validatePassword(formData.password);

    if (passwordError) {
      setErrorMsg(passwordError);
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMsg("Please enter a valid email address (e.g., name@organization.org)");
      return;
    }

    try {
      setIsSubmitting(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgName: formData.orgName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phone: formData.phone,
          address: formData.address,
          website: formData.website,
          accountType: "organization",
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMsg(data.message || "Signup failed");
        return;
      }
      localStorage.setItem("token", data.data.token);
      setSuccessMsg("Organization account created successfully!");
      // Reset form
      setFormData({
        orgName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        website: "",
        accountType: "organization",
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

  const goHome = () => {
    if (typeof onNavigate === "function") {
      onNavigate("landing");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="org-signup-outer">
      <div className="org-signup-hero">
        <div className="org-blob org-blob-1" />
        <div className="org-blob org-blob-2" />
        <div className="org-blob org-blob-3" />

        <div className="org-hero-content">
          <div className="org-hero-logo">🏢</div>
          <h2 className="org-hero-title">
            Join as an
            <br />
            Organization
          </h2>
          <p className="org-hero-subtitle">
            Build your community, run campaigns, and drive real-world impact
            through Merch4Change.
          </p>
          <ul className="org-hero-features">
            <li>
              <span>📣</span> Launch fundraising campaigns
            </li>
            <li>
              <span>🛒</span> Create a merch storefront
            </li>
            <li>
              <span>📊</span> Track donations &amp; analytics
            </li>
            <li>
              <span>🤝</span> Partner with impact brands
            </li>
          </ul>
        </div>
      </div>

      <div className="org-signup-form-panel">
        <div className="org-signup-form-container">
          <div
            className="org-brand-mark"
            onClick={goHome}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                goHome();
              }
            }}
          >
            M
          </div>

          <h1>Create Organization Account</h1>
          <p className="org-form-subtitle">
            Start your journey and build impact with your community.
          </p>

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

          <form className="org-form" onSubmit={handleSubmit}>
            <div className="org-form-group">
              <label>Organization Name</label>
              <input
                type="text"
                name="orgName"
                value={formData.orgName}
                onChange={handleChange}
                required
                placeholder="Your organization"
              />
            </div>

            <div className="org-form-group">
              <label>Email</label>
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@organization.org"
                  style={{
                    width: "100%",
                    padding: "12px 40px 12px 14px",
                    border: emailStatus.status === "valid" ? "2px solid #27ae60" : emailStatus.status === "invalid" ? "2px solid #e74c3c" : "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "#fafafa",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s ease",
                  }}
                />
                {formData.email && (
                  <span style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: emailStatus.status === "valid" ? "#27ae60" : emailStatus.status === "invalid" ? "#e74c3c" : "#999",
                    pointerEvents: "none",
                  }}>
                    {emailStatus.status === "valid" ? "✓" : emailStatus.status === "invalid" ? "✕" : ""}
                  </span>
                )}
              </div>
              {formData.email && emailStatus.status === "invalid" && (
                <div style={{
                  marginTop: "8px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  fontWeight: "600",
                  borderRadius: "6px",
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  border: "2px solid #f5c6cb",
                  boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
                  animation: "slideIn 0.3s ease-in-out",
                }}>
                  ✕ {emailStatus.message}
                </div>
              )}
              {formData.email && emailStatus.status === "valid" && (
                <div style={{
                  marginTop: "8px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  fontWeight: "600",
                  borderRadius: "6px",
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  border: "2px solid #28a745",
                  boxShadow: "0 2px 8px rgba(40, 167, 69, 0.2)",
                  animation: "slideIn 0.3s ease-in-out",
                }}>
                  ✓ {emailStatus.message}
                </div>
              )}
            </div>

            <div className="org-form-group">
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

            <div className="org-form-group">
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

            <div className="org-form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>

            <div className="org-form-group full-width">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Organization address"
              />
            </div>

            <div className="org-form-group full-width">
              <label>Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://your-website.org"
              />
            </div>

            <button
              type="submit"
              className="org-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Organization Account"}
            </button>

            <p className="org-login-prompt">
              Already have an account?{" "}
              <span
                className="org-login-link"
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

export default OrgSignupPage;