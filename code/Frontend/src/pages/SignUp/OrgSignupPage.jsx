import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrgSignupPage.css";

function OrgSignupPage({ onNavigate }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        orgName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        website: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
          alert('Server configuration is missing. Please contact support.');
          return;
        }

            const response = await fetch(`${apiUrl}/api/v1/profiles/organization`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.message || 'Signup failed');
                return;
            }
            localStorage.setItem('token', data.data.token);
            alert('Organization account created successfully!');
            // Reset form
            setFormData({
                orgName: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                address: '',
                website: ''
            });
        } catch {
            alert('Network error. Please try again.');
        }
    };

    const goHome = () => {
        if (typeof onNavigate === 'function') {
            onNavigate('landing');
        } else {
            window.location.href = '/';
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
                        Join as an<br />Organization
                    </h2>
                    <p className="org-hero-subtitle">
                        Build your community, run campaigns, and drive real-world impact through Merch4Change.
                    </p>
                    <ul className="org-hero-features">
                        <li><span>📣</span> Launch fundraising campaigns</li>
                        <li><span>🛒</span> Create a merch storefront</li>
                        <li><span>📊</span> Track donations &amp; analytics</li>
                        <li><span>🤝</span> Partner with impact brands</li>
                    </ul>
                </div>
            </div>

                <div className="org-signup-form-panel">
                  <div className="org-signup-form-container">
                    <div className="org-brand-mark" onClick={goHome} role="button" tabIndex={0} onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        goHome();
                      }
                    }}>
                      M
                    </div>

                    <h1>Create Organization Account</h1>
                    <p className="org-form-subtitle">
                      Start your journey and build impact with your community.
                    </p>

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
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="name@organization.org"
                        />
                      </div>

                      <div className="org-form-group">
                        <label>Password</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength={8}
                          placeholder="Min. 8 characters"
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
                          minLength={8}
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
                          required
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
                          required
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

                      <button type="submit" className="org-submit-btn">
                        Create Organization Account
                      </button>

                      <p className="org-login-prompt">
                        Already have an account?{' '}
                        <span
                          className="org-login-link"
                          onClick={() => navigate('/login')}
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
