import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import SelectSignUp from "./pages/SelectSignUp/SelectSignUp";
import LoginPage from "./pages/LoginPage/LoginPage";
import MessagingInterface from "./components/Message/MessagingInterface";
import Home from "./pages/Home/Home";
import UserProfile from "./pages/UserProfile/UserProfile";
import OrgSignupPage from "./pages/SignUp/OrgSignupPage";
import Settings from "./pages/Settings/Settings";
import OrgProfile from "./pages/OrgProfile/OrgProfile";
import OrgCommunities from "./pages/OrgCommunities/OrgCommunities";
import OrgProjects from "./pages/OrgProjects/OrgProjects";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                {/*path gives the address on the address bar, element is the component that will be rendered when the path is accessed */}
                {/* The landing page is the default route */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SelectSignUp />} />
                <Route path="/signup/orgsignup" element={<OrgSignupPage />} />
        
                {/* Private/App Routes */}
                <Route path="/home" element={<Home />} />
                <Route path="/messaging" element={<MessagingInterface />} />
                <Route path="/settings" element={<Settings />} />

                {/* Dynamic Route: Perfect for Social Media Profiles */}
                <Route path="/profile/:username" element={<UserProfile />} />
                {/* Dynamic Route: Perfect for Charity Profiles */}
                <Route path="/organization/:username" element={<OrgProfile />} />
                <Route path="/organization/:username/projects" element={<OrgProjects />} />
                <Route path="/organization/:username/communities" element={<OrgCommunities />} />

                {/* Fallback: Redirect any unknown URL to landing */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    )
}
export default App;

