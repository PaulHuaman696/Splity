import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/authFetch"; // si lo creaste

const Dashboard = () => {
  type UserData = {
    name: string;
    email: string;
    uid: string;
  };

  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    authFetch("http://localhost:4000/api/user/me") // Asegúrate que el token se pasa con esta llamada
      .then((data) => {
        setUserData(data);  // Datos del usuario devueltos por la API
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Error de autenticación. Redirigiendo...");
        setTimeout(() => navigate("/login"), 2000);
      });
  }, [navigate]);

  if (error) return <p>{error}</p>;

  if (!userData) return <p>Cargando usuario...</p>;

  return (
    <div>
      <h1>Bienvenido, {userData.name || userData.email}</h1>
      <div>
        <p>Resumen de actividad</p>
        {/* Aquí podrías agregar gráficos o estadísticas */}
      </div>
      <div>
        <h3>Gastos recientes</h3>
        <ul>
          {/* Lista de los últimos gastos */}
          <li>Gasto 1 - $50</li>
          <li>Gasto 2 - $100</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
