import { useState } from "react";
import LandingPage from "./pages/landing/LandingPage";
import SelectSignUp from "./pages/selectsignup/SelectSignUp";
import LoginPage from "./pages/login/LoginPage"; 
import OrgSignupPage from "./pages/signup/OrgSignupPage";
import MessagingInterface from "./components/Message/MessagingInterface";
import Settings from "./pages/Settings";

function App() {
  const [page, setPage] = useState(() => {
    try {
      return localStorage.getItem("page") || "landing";
    } catch (e) {
      return "landing";
    }
  });

  const navigate = (to) => {
    setPage(to);
    try {
      localStorage.setItem("page", to);
    } catch (e) {
      console.error("Navigation error:", e);
    }
  };

  return (
    <>
      {page === "landing" && <LandingPage onNavigate={navigate} />}
      {page === "login" && <LoginPage onNavigate={navigate} />}
      {page === "selectsignup" && <SelectSignUp onNavigate={navigate} />}
      {page === "organizationsignup" && <OrgSignupPage onNavigate={navigate} />}
      {page === "messaging" && <MessagingInterface onNavigate={navigate} />}
      {page === "settings" && <Settings onNavigate={navigate} />}
    </>
  );
}

export default App;