import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserSignupPage.css";

function UserSignupPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        console.log('User signup data:', formData);
        // TODO: Submit to backend
        alert('User account created!');
        setFormData({
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
    };

    return (
        <div className="user-signup-outer">

            {/* ── Left hero panel ── */}
            <div className="user-signup-hero">
                <div className="user-blob user-blob-1" />
                <div className="user-blob user-blob-2" />
                <div className="user-blob user-blob-3" />

                <div className="user-hero-content">
                    <div className="user-hero-logo">👤</div>
                    <h2 className="user-hero-title">
                        Join as a<br />User
                    </h2>
                    <p className="user-hero-subtitle">
                        Shop with purpose, support causes you care about, and rank up as you make an impact.
                    </p>
                    <ul className="user-hero-features">
                        <li><span>🛍️</span> Buy &amp; sell impact products</li>
                        <li><span>🎁</span> Donate items to causes</li>
                        <li><span>🏆</span> Earn ranks &amp; rewards</li>
                        <li><span>🌱</span> Follow your favourite orgs</li>
                    </ul>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="user-signup-form-panel">
                <div className="user-signup-form-container">

                    <div className="user-brand-mark">🌿</div>

                    <h1>Create Your Account</h1>
                    <p className="user-form-subtitle">It's free and always will be</p>

                    <form onSubmit={handleSubmit} className="user-form">

                        {/* First & Last name */}
                        <div className="user-form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                placeholder="John"
                            />
                        </div>

                        <div className="user-form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                placeholder="Doe"
                            />
                        </div>

                        {/* Username – full width */}
                        <div className="user-form-group full-width">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="e.g. johndoe42"
                            />
                        </div>

                        {/* Email – full width */}
                        <div className="user-form-group full-width">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div className="user-form-group">
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
                        <div className="user-form-group">
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

                        <button type="submit" className="user-submit-btn">
                            Create Account
                        </button>

                        <p className="user-login-prompt">
                            Already have an account?{" "}
                            <span
                                className="user-login-link"
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

export default UserSignupPage;
