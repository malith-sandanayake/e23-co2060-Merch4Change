import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import BrandSection from "./BrandSection";

function LandingPage() {

    const navigate = useNavigate();

    return (
    <>
        <div className="landing-page">
            <div className="title1">
                <h1 style={{fontSize: "40px", textAlign: "left",fontWeight: 600, fontFamily: "Poppins",background: "linear-gradient(90deg, #0f2027, #345864, #547e90)",
                WebkitBackgroundClip: "text",WebkitTextFillColor: "transparent", }}>
                Stay Connected
                <br/>with your
                <br/>Favourite Brands</h1>
            </div>
            <div className="sub-topic">
                <p style={{fontSize: "20px"}}>Connect . Act . Impact . Shop</p>
            </div>

            <div className="landing-buttons-container">
                <button onClick={() => navigate('/login')} className="landing-btn landing-btn-primary">Login</button>
                <button onClick={() => navigate('/signup')} className="landing-btn landing-btn-secondary">Sign Up</button>
            </div>
        </div>
        <BrandSection/>
    </>
    );
}

export default LandingPage;