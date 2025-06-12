import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import "./Navbar.css";

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <button className="hamburger" onClick={toggleSidebar} aria-label="Toggle sidebar">
        <i className="fas fa-bars"></i>
      </button>
      <div className="navbar-title">Splity</div>
      <button onClick={handleLogout} className="navbar-button">
        Cerrar sesión
      </button>
    </nav>
  );
};

export default Navbar;
  