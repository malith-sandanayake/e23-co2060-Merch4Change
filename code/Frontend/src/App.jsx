import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import SelectSignUp from "./pages/SelectSignUp/SelectSignUp";
import LoginPage from "./pages/LoginPage/LoginPage";
import MessagingInterface from "./components/Message/MessagingInterface";
import Home from "./pages/Home/Home";
import UserProfile from "./pages/UserProfile/UserProfile";
import MarketplacePage from "./pages/Marketplace/Marketplace";
import SignUpPage from "./pages/SignUp/SignUpPage";
import Settings from "./pages/Settings/Settings";
import OrgProfile from "./pages/OrgProfile/OrgProfile";
import OrgCommunities from "./pages/OrgCommunities/OrgCommunities";
import OrgProjects from "./pages/OrgProjects/OrgProjects";
import PublicLayout from "./components/PublicLayout/PublicLayout";
import FAQ from "./pages/FAQ/FAQ";
import HelpAndSupport from "./pages/HelpAndSupport/HelpAndSupport";
import Contact from "./pages/HelpAndSupport/Contact";
import OurStory from "./pages/About/OurStory";
import Mission from "./pages/About/Mission";
import Team from "./pages/About/Team";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Marketplace from "./pages/Marketplace/Marketplace";
import { Analytics } from "@vercel/analytics/react"; //vercel analytics

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/*path gives the address on the address bar, element is the component that will be rendered when the path is accessed */}
        {/* The landing page is the default route */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help" element={<HelpAndSupport />} />
          <Route path="/help/contact" element={<Contact />} />
          <Route path="/about/story" element={<OurStory />} />
          <Route path="/about/mission" element={<Mission />} />
          <Route path="/about/team" element={<Team />} />
        </Route>

        {/* Private/App Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/messaging" element={<ProtectedRoute><MessagingInterface /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile/me" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />

        {/* Dynamic Route: Perfect for Social Media Profiles */}
        <Route path="/profile/:username" element={<UserProfile />} />
        {/* Dynamic Route: Perfect for Charity Profiles */}
        <Route path="/organization/:username" element={<OrgProfile />} />
        <Route
          path="/organization/:username/projects"
          element={<OrgProjects />}
        />
        <Route
          path="/organization/:username/communities"
          element={<OrgCommunities />}
        />

        {/* Fallback: Redirect any unknown URL to landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Analytics />
    </Router>
  );
}
export default App;
