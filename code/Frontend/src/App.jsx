import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import SelectSignUp from "./pages/selectsignup/SelectSignUp";
import LoginPage from "./pages/login/LoginPage";
import MessagingInterface from "./components/Message/MessagingInterface";
import Home from "./pages/Home/Home";
import Profile from "./pages/profile/Profile";
import OrgSignupPage from "./pages/signup/OrgSignupPage";
import Settings from "./pages/Settings/Settings";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SelectSignUp />} />
                <Route path="/signup/orgsignup" element={<OrgSignupPage />} />
        
                {/* Private/App Routes */}
                <Route path="/home" element={<Home />} />
                <Route path="/messaging" element={<MessagingInterface />} />
                <Route path="/settings" element={<Settings />} />

                {/* Dynamic Route: Perfect for Social Media Profiles */}
                <Route path="/profile/:username" element={<Profile />} />

                {/* Fallback: Redirect any unknown URL to landing */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    )
}
export default App;

