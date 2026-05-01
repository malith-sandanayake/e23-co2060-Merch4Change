import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";
import icon from "../../assets/icon.png";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo-row">
            <img src={icon} alt="Merch4Change icon" className="footer-logo" />
            <span className="footer-title">Merch4Change</span>
          </div>
          <p className="footer-desc">
            Empowering communities through impact-led commerce. Connect with
            your favorite brands to make a difference.
          </p>
        </div>

        <div className="footer-links-section">
          <div className="footer-column">
            <h4>About Us</h4>
            <ul>
              <li onClick={() => navigate("/about/story")}>Our Story</li>
              <li onClick={() => navigate("/about/mission")}>Our Mission</li>
              <li onClick={() => navigate("/about/team")}>Team Antigravity</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li onClick={() => navigate("/help")}>Help Center</li>
              <li onClick={() => navigate("/faq")}>FAQs</li>
              <li onClick={() => navigate("/help/contact")}>Contact Us</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Merch4Change. All rights reserved.
        </p>
        <div className="footer-socials">
          <span className="social-icon">IN</span>
          <span className="social-icon">TW</span>
          <span className="social-icon">FB</span>
          <span className="social-icon">IG</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
