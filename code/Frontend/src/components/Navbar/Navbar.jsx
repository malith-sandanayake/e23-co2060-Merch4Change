import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import icon from "../../assets/icon.png"

function Navbar() {
  {/* Creating a navigation function to handle routing */}
  const navigate = useNavigate();
  const location = useLocation();

  {/* Determine which page is currently active to conditionally render buttons */}
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const issignUpPage = location.pathname === '/signup';
  const isOrgSignUpPage = location.pathname === '/signup/orgsignup'

  {/* The main return statement of the Navbar component. It includes:
      - A logo that navigates to the home page when clicked
      - Conditional rendering of buttons based on the current page
  */}
  return (
    <>
      <nav className="navbar">
        {/* Logo section with an image that serves as a clickable element to navigate back to the home page. */}
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: "pointer" }}>
          <img src={icon} width={50} style={{ borderRadius: 10 }} />
        </div>

        {/* Conditional rendering of buttons based on the current page.
            - On the landing page, both "Log In" and "Create an Account" buttons are shown.
            - On the login page, only the "Create an Account" button is shown.
            - On the signup selection page, only the "Log In" button is shown.
            - On the organization signup page, both buttons are shown again. */}
        <div className="Navbar">
          <div className="actions">
            {isLandingPage && (
              <>
                <button onClick={() => navigate('/login')} className="lgn-btn" >Log In</button>
                <button onClick={() => navigate('/signup')} className="create-btn">Create an Account</button>
              </>
            )}

            {
              isLoginPage && (
                <>
                  <button onClick={() => navigate('/signup')} className="create-btn">Create an Account</button>
                </>
            )}

            {
              issignUpPage &&(
                <>
                <button onClick={() => navigate('/login')} className="lgn-btn" >Log In</button>
                </>
              )
            }

            {isOrgSignUpPage && (
              <>
                <button onClick={() => navigate('/login')} className="lgn-btn" >Log In</button>
                <button onClick={() => navigate('/signup')} className="create-btn">Create an Account</button>
              </>
            )}

            {/*<button onClick={() => navigate('/messaging')} className="landing-btn landing-btn-secondary">Chat</button>*/}
          </div>
        </div>

      </nav>
    </>
  );
}

export default Navbar;
