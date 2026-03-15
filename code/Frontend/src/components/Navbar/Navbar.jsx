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
      { label: "Project Idea", target: "/#services" },
      { label: "Why Merch4Change", target: "/#services" },
      { label: "Partner Network", target: "/#brand-network" },
    ],
  },
  {
    label: "Help & Support",
    items: [
      { label: "Getting Started", target: "/#support-start" },
      { label: "FAQs", target: "/#support-faq" },
      { label: "Contact Support", target: "/#support-contact" },
    ],
  },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const navbarRef = useRef(null);

  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname.startsWith("/signup");

  const showLoginButton = !isLoginPage;
  const showSignUpButton = !isSignUpPage;

  const handleNavigation = (target) => {
    setOpenMenu(null);
    navigate(target);
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname, location.hash]);

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-shell">
        <button
          type="button"
          className="navbar-brand"
          onClick={() => handleNavigation("/")}
        >
          <img src={icon} alt="Merch4Change app icon" className="navbar-logo" />
          <span className="navbar-brand-copy">
            <strong>Merch4Change</strong>
            <span>Impact-led commerce</span>
          </span>
        </button>

        <div className="navbar-center">
          {navDropdowns.map((dropdown) => (
            <div key={dropdown.label} className="nav-dropdown">
              <button
                type="button"
                className={`nav-dropdown-trigger ${openMenu === dropdown.label ? "is-open" : ""}`}
                onClick={() => setOpenMenu(openMenu === dropdown.label ? null : dropdown.label)}
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
          <button onClick={() => navigate("/login")} className="lgn-btn">Log In</button>
        )}

        {showSignUpButton && (
          <button onClick={() => navigate("/signup")} className="create-btn">Sign Up</button>
        )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
