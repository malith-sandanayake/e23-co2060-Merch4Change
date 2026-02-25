import "./LandingPage.css";
import Navbar from "../../components/Navbar";
import BrandSection from "./BrandSection";

function LandingPage({ onNavigate }) {

    // Function to handle navigation to pages
    const goToPage = (page) => {
        if (typeof onNavigate === 'function') {
            onNavigate(page);
        } else {
            window.location.href = `/${page}`;
        }
    }

    return (
    <>
        <Navbar/>
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
                <button onClick={() => goToPage('login')} className="landing-btn landing-btn-primary">Login</button>
                <button onClick={() => goToPage('selectsignup')} className="landing-btn landing-btn-secondary">Sign Up</button>
            </div>
        </div>
        <BrandSection/>
    </>
    );
}

export default LandingPage;