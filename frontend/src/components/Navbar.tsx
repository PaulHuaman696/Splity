import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={navbarStyle}>
      <div style={titleStyle}>Splity</div>
      <button onClick={handleLogout} style={buttonStyle}>
        Cerrar sesión
      </button>
    </nav>
  );
};

// ✅ Tipado correcto para estilos en TypeScript
const navbarStyle: React.CSSProperties = {
  height: "70px",
  backgroundColor: "#4f46e5",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 20px",
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const titleStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "bold",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Navbar;
  