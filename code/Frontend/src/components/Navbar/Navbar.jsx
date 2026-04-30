
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

function Navbar({ scrolled = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  const isLandingPage = location.pathname === "/";

  const scrollTo = (id) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`lp-navbar ${scrolled ? "lp-navbar--scrolled" : ""}`}
      ref={navbarRef}
    >
      <div className="lp-navbar-container">
        {/* Left: Logo */}
        <button
          className="lp-navbar-brand"
          onClick={() => handleNavigation("/")}
          aria-label="Merch4Change"
        >
          <div className="lp-navbar-icon">M</div>
          <span className="lp-navbar-text">Merch4Change</span>
        </button>

        {/* Center: Navigation (desktop only) */}
        {isLandingPage && (
          <div className="lp-navbar-center">
            <button
              className="lp-navbar-link"
              onClick={() => scrollTo("how-it-works")}
            >
              How it works
            </button>
            <button
              className="lp-navbar-link"
              onClick={() => handleNavigation("/marketplace")}
            >
              Marketplace
            </button>
            <button
              className="lp-navbar-link"
              onClick={() => scrollTo("for-organisations")}
            >
              For Organisations
            </button>
            <button
              className="lp-navbar-link"
              onClick={() => scrollTo("impact-stats")}
            >
              Impact
            </button>
          </div>
        )}

        {/* Right: Buttons */}
        <div className="lp-navbar-actions">
          <button
            className="lp-navbar-signin"
            onClick={() => handleNavigation("/login")}
          >
            Sign in
          </button>
          <button
            className="lp-navbar-getstarted"
            onClick={() => handleNavigation("/signup")}
          >
            Get started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        {isLandingPage && (
          <button
            className="lp-navbar-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isLandingPage && isMobileMenuOpen && (
        <div className="lp-navbar-mobile-menu">
          <button
            className="lp-navbar-mobile-link"
            onClick={() => scrollTo("how-it-works")}
          >
            How it works
          </button>
          <button
            className="lp-navbar-mobile-link"
            onClick={() => handleNavigation("/marketplace")}
          >
            Marketplace
          </button>
          <button
            className="lp-navbar-mobile-link"
            onClick={() => scrollTo("for-organisations")}
          >
            For Organisations
          </button>
          <button
            className="lp-navbar-mobile-link"
            onClick={() => scrollTo("impact-stats")}
          >
            Impact
          </button>

          <div className="lp-navbar-mobile-divider"></div>

          <div className="lp-navbar-mobile-buttons">
            <button
              className="lp-navbar-signin"
              onClick={() => handleNavigation("/login")}
            >
              Sign in
            </button>
            <button
              className="lp-navbar-getstarted"
              onClick={() => handleNavigation("/signup")}
            >
              Get started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

