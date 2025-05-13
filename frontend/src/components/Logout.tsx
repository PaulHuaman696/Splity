// Logout.tsx
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Cerrar sesión en Firebase
      navigate("/login");  // Redirigir a login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
};

export default Logout;
