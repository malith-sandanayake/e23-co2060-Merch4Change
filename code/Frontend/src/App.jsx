import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import SelectSignUp from "./pages/SelectSignUp/SelectSignUp";
import LoginPage from "./pages/LoginPage/LoginPage";
import MessagingPage from "./pages/Messaging/MessagingPage";
import Home from "./pages/Home/Home";
import UserProfile from "./pages/UserProfile/UserProfile";
import MarketplacePage from "./pages/Marketplace/Marketplace";
import SignUpPage from "./pages/SignUp/SignUpPage";
import OrgSignupPage from "./pages/SignUp/OrgSignupPage";
import UserSignupPage from "./pages/SignUp/UserSignupPage";
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
import DonationsPage from "./pages/Donations/DonationsPage";
import UnderConstruction from "./components/UnderConstruction/UnderConstruction";
// this is for mock test while building - Notification Drop Down
import NotificationDropDown from "./components/Notifications/NotificationDropDown";
import { Analytics } from "@vercel/analytics/react"; //vercel analytics

function App() {

  // delete this - notification drop down 
  const notifications = [{id:"1",type:"Purchase",message:"Your order has been confirmed.",isRead:false,createdAt:"2026-05-12 10:30 AM"},{id:"2",type:"Message",message:"John sent you a new message.",isRead:true,createdAt:"2026-05-12 09:15 AM"},{id:"3",type:"Donation",message:"Thank you for donating $20.",isRead:false,createdAt:"2026-05-11 08:00 PM"},{id:"4",type:"Friend Request",message:"Anna sent you a friend request.",isRead:true,createdAt:"2026-05-11 06:45 PM"},{id:"5",type:"System",message:"System maintenance scheduled tonight.",isRead:false,createdAt:"2026-05-11 05:00 PM"},{id:"6",type:"product",message:"A seller replied to your inquiry.",isRead:true,createdAt:"2026-05-10 03:20 PM"},{id:"7",type:"Community",message:"You joined the Web Developers community.",isRead:false,createdAt:"2026-05-10 11:10 AM"},{id:"8",type:"Security",message:"New login detected from Chrome browser.",isRead:true,createdAt:"2026-05-09 09:00 PM"},{id:"9",type:"Project",message:"Your project submission was approved.",isRead:false,createdAt:"2026-05-09 01:25 PM"},{id:"10",type:"Reminder",message:"Don't forget tomorrow's meeting.",isRead:true,createdAt:"2026-05-08 07:30 PM"}];
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/*path gives the address on the address bar, element is the component that will be rendered when the path is accessed */}
        {/* The landing page is the default route */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help" element={<HelpAndSupport />} />
          <Route path="/help/contact" element={<Contact />} />
          <Route path="/about/story" element={<OurStory />} />
          <Route path="/about/mission" element={<Mission />} />
          <Route path="/about/team" element={<Team />} />
        </Route>

        {/* Auth Routes (No Navbar) */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup/orgsignup" element={<OrgSignupPage />} />
        <Route path="/signup/usersignup" element={<UserSignupPage />} />

        {/* Private/App Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/messaging" element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile/me" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/donations" element={<ProtectedRoute><DonationsPage /></ProtectedRoute>} />
        <Route path="/under-construction" element={<ProtectedRoute><UnderConstruction /></ProtectedRoute>} />

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
      <NotificationDropDown notifications= {notifications}/>
      <Analytics />
    </Router>
  );
}
export default App;
