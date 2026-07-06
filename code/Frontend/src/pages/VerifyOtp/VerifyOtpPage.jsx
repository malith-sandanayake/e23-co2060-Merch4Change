import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./VerifyOtpPage.css";

function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const inputRefs = useRef([]);

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // take only the last character if they pasted something
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // move to next input if current is filled
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pasteData.some(char => isNaN(char))) return;

    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    // focus the last filled input or the very last one
    const focusIndex = Math.min(pasteData.length, 5);
    inputRefs.current[focusIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit code.");
      return;
    }

    try {
      setIsSubmitting(true);
      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiBaseUrl}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otpCode: otpValue }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.message || "Invalid verification code.");
        return;
      }

      if (data?.data?.token) {
        localStorage.setItem("token", data.data.token);
      }

      setSuccessMsg("Verification successful!");
      
      const accountType = data?.data?.user?.accountType || "user";
      
      setTimeout(() => {
        if (accountType === "organization") {
          navigate("/home"); // Adjust if there's a specific org route
        } else {
          navigate("/home");
        }
      }, 1500);
      
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goHome = () => navigate("/");

  if (!email) return null;

  return (
    <div className="verify-otp-outer">
      <div className="verify-otp-hero">
        <div className="verify-blob verify-blob-1" />
        <div className="verify-blob verify-blob-2" />
        <div className="verify-hero-content">
          <div className="verify-hero-logo">✉️</div>
          <h2 className="verify-hero-title">
            Verify Your<br />
            Email
          </h2>
          <p className="verify-hero-subtitle">
            You're just one step away from joining Merch4Change.
          </p>
        </div>
      </div>

      <div className="verify-otp-form-panel">
        <div className="verify-otp-form-container">
          <div
            className="verify-brand-mark"
            onClick={goHome}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") goHome(); }}
          >
            M
          </div>

          <h1>Enter Verification Code</h1>
          <p className="verify-form-subtitle">
            We sent a 6-digit code to <strong>{email}</strong>
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

          <form className="verify-form" onSubmit={handleSubmit}>
            <div className="otp-inputs-container">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="otp-input"
                />
              ))}
            </div>

            <button type="submit" className="verify-btn" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
          
          <div className="verify-footer">
            <p>Didn't receive a code? <span className="resend-link">Resend</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtpPage;
