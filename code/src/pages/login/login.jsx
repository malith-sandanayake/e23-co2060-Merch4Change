import { useState } from "react";
import "./login.css";

function LoginPage({ onNavigate }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login data:', formData);
        // TODO: Submit to backend
        alert('Login submitted!');
    };

    const goHome = () => {
        if (typeof onNavigate === 'function') {
            onNavigate('landing');
        } else {
            window.location.href = '/';
        }
    };

    const goToPage = (page) => {
        if (typeof onNavigate === 'function') {
            onNavigate(page);
        } else {
            window.location.href = `/${page}`;
        }
    };

    return (
        <>
            <div className="login-nav-bar">
                <button onClick={goHome} className="logo-btn">LOGO</button>
            </div>

            <div className="login-container">
                <div className="login-form-wrapper">
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to your account</p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="login-form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="login-forgot-password">
                            <a href="#forgot">Forgot password?</a>
                        </div>

                        <button type="submit" className="login-submit-btn">
                            Sign In
                        </button>
                    </form>

                    <div className="login-divider">
                        <span>or</span>
                    </div>

                    <div className="login-signup-prompt">
                        <p>Don't have an account? <span onClick={() => goToPage('selectsignup')} className="signup-link">Sign up here</span></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
