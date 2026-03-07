import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import icon from "../../assets/icon.png"

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const issignUpPage = location.pathname === '/signup';
  const isOrgSignUpPage = location.pathname === '/signup/orgsignup'

  return (
    <>
      <nav className="navbar">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: "pointer" }}>
          <img src={icon} width={50} style={{ borderRadius: 10 }} />
        </div>

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
