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
            // Use environment variable for API URL
            const apiUrl = process.env.VITE_API_URL;

            const response = await fetch('${apiUrl}/api/v1/profiles/organization', {
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
        } catch (err) {
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

            {/* ── Left hero panel ── */}
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

            {/* ── Right form panel ── */}
            <div className="org-signup-form-panel">
                <div className="org-signup-form-container">

                    <div className="org-brand-mark">🌿</div>



                    <h1>Create Organization Account</h1>
                    <p className="org-form-subtitle">Fill in your details to get started</p>

                    <form onSubmit={handleSubmit} className="org-form">

                        {/* Organization Name – full width */}
                        <div className="org-form-group full-width">
                            <label>Organization Name</label>
                            <input
                                type="text"
                                name="orgName"
                                value={formData.orgName}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Green Future Foundation"
                            />
                        </div>

                        {/* Email */}
                        <div className="org-form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="org@example.com"
                            />
                        </div>

                        {/* Phone */}
                        <div className="org-form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="+94 77 xxx xxxx"
                            />
                        </div>

                        {/* Address */}
                        <div className="org-form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                placeholder="Street, City"
                            />
                        </div>

                        {/* Website */}
                        <div className="org-form-group">
                            <label>Website <small style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</small></label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://yourorg.com"
                            />
                        </div>

                        {/* Password */}
                        <div className="org-form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Min. 8 characters"
                            />
                        </div>

                        {/* Confirm Password */}
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

                        <button type="submit" className="org-submit-btn">
                            Create Organization Account
                        </button>

                        <p className="org-login-prompt">
                            Already have an account?{" "}
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
