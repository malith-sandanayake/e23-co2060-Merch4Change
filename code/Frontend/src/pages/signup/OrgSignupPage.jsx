import { useState } from "react";
import "./OrgSignupPage.css";
import Navbar from "../../components/Navbar/Navbar";

function OrgSignupPage({ onNavigate }) {
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
            const response = await fetch('http://localhost:5000/api/v1/profiles/organization', {
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
        <>
            <Navbar />
            <div className="org-signup-form-container">
                <h1>Create Organization Account</h1>

                <form onSubmit={handleSubmit} className="org-form">
                    <div className="org-form-group">
                        <label>Organization Name</label>
                        <input
                            type="text"
                            name="orgName"
                            value={formData.orgName}
                            onChange={handleChange}
                            required
                            placeholder="Enter organization name"
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
                            placeholder="Enter email address"
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
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="org-form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            placeholder="Enter address"
                        />
                    </div>

                    <div className="org-form-group">
                        <label>Website</label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="Enter website URL"
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
                            placeholder="Enter password"
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
                            placeholder="Confirm password"
                        />
                    </div>

                    <button type="submit" className="org-submit-btn">
                        Create Account
                    </button>
                </form>
            </div>
        </>
    );
}

export default OrgSignupPage;
