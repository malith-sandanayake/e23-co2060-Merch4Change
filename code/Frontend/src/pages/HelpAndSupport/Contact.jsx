import React from "react";
import "./Contact.css";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Support request submitted successfully!");
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            We're here to help! Send us a message and our support team will get
            back to you within 24 hours.
          </p>

          <div className="contact-details">
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <div>
                <h4>Headquarters</h4>
                <p>Sri Lanka</p>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">📧</span>
              <div>
                <h4>Email Us</h4>
                <p>support@merch4change.org</p>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">📞</span>
              <div>
                <h4>Call Us</h4>
                <p>+94 11 234 5678</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          <h3>Send a Message</h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Jagath Hemantha" required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="jagath@example.com" required />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <select required>
                <option value="">Select a topic...</option>
                <option value="account">Account Issues</option>
                <option value="campaign">Campaign Support</option>
                <option value="brand">Brand Collaboration</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                rows="5"
                placeholder="How can we help you?"
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
