import { useNavigate } from "react-router-dom";
import "./SelectSignUp.css";

function SelectSignUp() {
    const navigate = useNavigate();

    return (
        <div className="select-signup-page">
            {/* Heading */}
            <div className="heading">
                <div className="main-heading">
                    <h1>Which role do you act<br />in Platform?</h1>
                </div>
                <p className="title-des">Customize your experience for better engagement</p>
            </div>

            {/* Role selection cards */}
            <div className="selection">
                {/* Organization card */}
                <div
                    className="section1"
                    onClick={() => navigate('/signup/orgsignup')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="card-icon">🏢</div>
                    <h3>Create account as an Organization</h3>
                    <p>Fund raising and project management profiles for sustainable impact</p>
                    <span className="card-arrow">→</span>
                </div>

                {/* User card */}
                <div
                    className="section2"
                    onClick={() => navigate('/signup/usersignup')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="card-icon">👤</div>
                    <h3>Create account as a User</h3>
                    <p>Buy, sell and donate items to rank up and make a difference</p>
                    <span className="card-arrow">→</span>
                </div>
            </div>

            {/* Already have account */}
            <p className="login-prompt">
                Already have an account?{" "}
                <span onClick={() => navigate('/login')}>Log in here</span>
            </p>
        </div>
    );
}

export default SelectSignUp;