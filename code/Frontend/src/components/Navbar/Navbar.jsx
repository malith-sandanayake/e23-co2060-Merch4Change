import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import icon from "../../assets/icon.png";

const navDropdowns = [
  {
    label: "Services",
    items: [
      { label: "Brand Collaboration", target: "/#service-brands" },
      { label: "Charity Campaigns", target: "/#service-charities" },
      { label: "Community Messaging", target: "/#service-community" },
    ],
  },
  {
    label: "About",
    items: [
      { label: "Our Story", target: "/about/story" },
      { label: "Our Mission", target: "/about/mission" },
      { label: "Team Antigravity", target: "/about/team" },
    ],
  },
  {
    label: "Help & Support",
    items: [
      { label: "Help Center", target: "/help" },
      { label: "FAQs", target: "/faq" },
      { label: "Contact Us", target: "/help/contact" },
    ],
  },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname.startsWith("/signup");

  const showLoginButton = !isLoginPage;
  const showSignUpButton = !isSignUpPage;

  const handleNavigation = (target) => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
    navigate(target);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setOpenMenu(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-shell">
        <div className="navbar-brand-container">
          <button
            type="button"
            className="navbar-brand"
            onClick={() => handleNavigation("/")}
          >
            <img
              src={icon}
              alt="Merch4Change app icon"
              className="navbar-logo"
            />
            <span className="navbar-brand-copy">
              <strong>Merch4Change</strong>
              <span>Impact-led commerce</span>
            </span>
          </button>

          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        <div
          className={`navbar-menu-wrapper ${isMobileMenuOpen ? "is-open" : ""}`}
        >
          <div className="navbar-center">
            {navDropdowns.map((dropdown) => (
              <div key={dropdown.label} className="nav-dropdown">
                <button
                  type="button"
                  className={`nav-dropdown-trigger ${openMenu === dropdown.label ? "is-open" : ""}`}
                  onClick={() =>
                    setOpenMenu(
                      openMenu === dropdown.label ? null : dropdown.label,
                    )
                  }
                  aria-expanded={openMenu === dropdown.label}
                >
                  {dropdown.label}
                  <span className="nav-dropdown-caret">▾</span>
                </button>

                {openMenu === dropdown.label && (
                  <div className="nav-dropdown-menu">
                    {dropdown.items.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className="nav-dropdown-item"
                        onClick={() => handleNavigation(item.target)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="navbar-actions">
            {showLoginButton && (
              <button onClick={() => navigate("/login")} className="lgn-btn">
                Log In
              </button>
            )}

            {showSignUpButton && (
              <button
                onClick={() => navigate("/signup")}
                className="create-btn"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
