import "./Navbar.css";
import icon from "../../assets/icon.png"

function Navbar() {
  return (
    <>
      <nav className="navbar">
        <div className="logo">
            <img src={icon} width={50} style={{borderRadius: 10}}/>
        </div>

        <div className="Navbar">
          <div className="actions">
            <button className="lgn-btn">Log In</button>
            <button className="create-btn">Create an Account</button>
          </div>
        </div>
        
      </nav>
    </>
  );
}

export default Navbar;
