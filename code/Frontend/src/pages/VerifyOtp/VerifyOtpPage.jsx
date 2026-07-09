import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/Context";
import "./VerifyOtpPage.css";

function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

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

    const focusIndex = Math.min(pasteData.length, 5);
    inputRefs.current[focusIndex]?.focus();
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
        credentials: "include",
        body: JSON.stringify({ email, otpCode: otpValue }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.message || "Invalid verification code.");
        return;
      }

      if (data?.data?.accessToken) {
        login(data.data.accessToken, data.data.user);
      }

      setSuccessMsg("Verification successful!");
      
      const accountType = data?.data?.user?.accountType || "user";
      
      setTimeout(() => {
        navigate("/home");
      }, 1500);
      
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    
    setErrorMsg("");
    setSuccessMsg("");
    setIsResending(true);
    
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiBaseUrl}/api/v1/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        if (response.status === 429 && data.remainingSeconds) {
          setResendTimer(data.remainingSeconds);
          setErrorMsg(data.message);
        } else {
          setErrorMsg(data.message || "Failed to resend verification code.");
        }
        return;
      }
      
      setSuccessMsg("Verification code resent successfully!");
      if (data.data?.nextCooldownSeconds) {
        setResendTimer(data.data.nextCooldownSeconds);
      } else {
        setResendTimer(60);
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="verify-otp-page">
      {/* Left panel */}
      <div className="verify-otp-left">
        <Link to="/" className="verify-otp-brand">
          <div className="verify-otp-brand-icon">M</div>
          <span className="verify-otp-brand-name">Merch4Change</span>
        </Link>

        <div className="verify-otp-hero">
          <h1 className="verify-otp-tagline">
            Secure your<br />
            <em>account</em> in<br />
            seconds.
          </h1>
          <p className="verify-otp-desc">
            We value your security. Please enter the verification code sent to your email to continue setting up your account.
          </p>
        </div>

        <div className="verify-otp-testimonial-wrap">
          <div className="verify-otp-testimonial">
            <p className="verify-otp-testimonial-text">
              "We take your privacy and security seriously. Two-step verification ensures that your impactful journey remains protected."
            </p>
            <div className="verify-otp-testimonial-author">
              <div className="verify-otp-avatar">M4C</div>
              <div>
                <div className="verify-otp-author-name">Security Team</div>
                <div className="verify-otp-author-role">Merch4Change</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="verify-otp-right">
        <div className="verify-otp-form-wrap">
          <p className="verify-otp-eyebrow">Verification</p>
          <h2 className="verify-otp-title">Check your email</h2>
          <p className="verify-otp-subtitle">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>

          {errorMsg && (
            <div className="verify-otp-error">{errorMsg}</div>
          )}
          {successMsg && (
            <div className="verify-otp-success">{successMsg}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
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

            <button
              type="submit"
              className="verify-otp-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying…" : "Verify & Continue"}
            </button>
          </form>

          <div className="verify-otp-footer">
            <p>Didn't receive a code?{" "}
              {resendTimer > 0 ? (
                <span style={{ fontWeight: 500, color: "#4a24e1" }}>
                  Resend in {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                </span>
              ) : (
                <button type="button" className="verify-otp-link" onClick={handleResend} disabled={isResending}>
                  {isResending ? "Sending..." : "Resend"}
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtpPage;
