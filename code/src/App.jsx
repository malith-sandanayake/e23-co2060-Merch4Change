import { useState } from "react";
import LandingPage from "./pages/landing";
import SelectSignUpMethod from "./pages/selectsignup";
import LoginPage from "./pages/login"; 
import OrganizationSignupPage from "./pages/organizationsignuppage";


function App() {
  const [page, setPage] = useState(() => {
    try {
      return localStorage.getItem('page') || 'landing';
    } catch (e) {
      return 'landing';
    }
  });
  
  const navigate = (to) => {
    setPage(to);
    try {
      localStorage.setItem('page', to) || 'landing';
    } catch (e) {
      return 'landing';
    }
  };

  return (
    <>
      {page === 'landing' && <LandingPage onNavigate={navigate} />}
      {page === 'login' && <LoginPage onNavigate={navigate} />}
      {page === 'selectsignup' && <SelectSignUpMethod onNavigate={navigate} />}
      {page === 'organizationsignup' && <OrganizationSignupPage onNavigate={navigate} />}
      
    </>
  );
}

export default App;