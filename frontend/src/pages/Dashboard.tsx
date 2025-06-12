import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authFetch } from "../utils/authFetch";
import ResumenMensual from "../components/ResumenMensual/ResumenMensual";
import GastosPorCategoriaChart from '../components/Graficos/GastosPorCategoriaChart';
import HistorialMensualChart from '../components/Graficos/HistorialMensualChart';
import TendenciaDiariaChart from '../components/Graficos/TendenciaDiariaChart';
import TopGastosChart from '../components/Graficos/TopGastosChart';
import "./Dashboard.css";

// Definimos los tipos de datos que vamos a recibir
type UserData = { name: string; email: string };
type Proyecto = { _id: string; nombre: string };
type GastoReciente = { _id: string; monto: number; item: string; proyectoId: { nombre: string } };
type SaldosGlobales = { meDeben: number; yoDebo: number };

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [gastosRecientes, setGastosRecientes] = useState<GastoReciente[]>([]);
  const [saldosGlobales, setSaldosGlobales] = useState<SaldosGlobales | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Usamos Promise.all para cargar todos los datos del dashboard en paralelo
    const fetchDashboardData = async () => {
      try {
        const [
          userData,
          proyectosData,
          gastosData,
          saldosData
        ] = await Promise.all([
          authFetch(`${api_url}/api/user/me`),
          authFetch(`${api_url}/api/projects`),
          authFetch(`${api_url}/api/reportes/gastos-recientes`),
          authFetch(`${api_url}/api/reportes/saldos-globales`)
        ]);

        setUserData(userData);
        setProyectos(proyectosData);
        setGastosRecientes(gastosData);
        setSaldosGlobales(saldosData);
      } catch (err) {
        console.error("Error cargando el dashboard:", err);
        setError("No se pudo cargar la información del dashboard.");
      }
    };

    fetchDashboardData();
  }, [navigate, api_url]);

  if (error) return <p className="error-text">{error}</p>;
  if (!userData) return <p className="loading-text">Cargando dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-greeting">Bienvenido, {userData.name || userData.email}</h1>

      <div className="dashboard-grid">
        {/* --- Sección de Resúmenes Principales --- */}
        <div className="dashboard-card resumen-card">
          <ResumenMensual />
        </div>

        <div className="dashboard-card saldos-card">
          <h2>Mis Saldos Globales</h2>
          {saldosGlobales ? (
            <div className="saldos-content">
              <div className="saldo-item me-deben">
                <span>Me deben</span>
                <strong>S/.{saldosGlobales.meDeben.toFixed(2)}</strong>
              </div>
              <div className="saldo-item yo-debo">
                <span>Yo debo</span>
                <strong>S/.{saldosGlobales.yoDebo.toFixed(2)}</strong>
              </div>
            </div>
          ) : <p>Calculando...</p>}
        </div>

        {/* --- Sección de Proyectos y Gastos --- */}
        <div className="dashboard-card proyectos-card">
          <h2>Mis Proyectos</h2>
          <ul className="proyectos-list">
            {proyectos.length > 0 ? proyectos.map(p => (
              <li key={p._id}>
                {/* Enlace al reporte específico del proyecto */}
                <Link to={`/reportes?proyectoId=${p._id}`}>{p.nombre}</Link>
              </li>
            )) : <p>No participas en ningún proyecto.</p>}
          </ul>
        </div>
        <div className="dashboard-card gastos-recientes-card">
          <h2>Gastos Recientes</h2>
          <ul className="gastos-list">
            {gastosRecientes.length > 0 ? gastosRecientes.map(g => (
              <li key={g._id}>
                <span className="gasto-item">{g.item || 'Gasto general'}</span>
                <span className="gasto-proyecto">{g.proyectoId?.nombre || 'N/A'}</span>
                <span className="gasto-monto">S/.{g.monto.toFixed(2)}</span>
              </li>
            )) : <p>No tienes gastos recientes.</p>}
          </ul>
        </div>

        {/* --- TÍTULO DE LA NUEVA SECCIÓN --- */}
        {/* Este h2 ocupará todo el ancho de la rejilla */}
        <h1 className="dashboard-section-title">Análisis Gráfico</h1>
        
        {/* --- TARJETA DEL GRÁFICO --- */}
        {/* Usamos una clase especial para que ocupe todo el ancho */}
        <div className="dashboard-card full-width-card">
          <h2>Tendencia de Gastos (Últimos 30 días)</h2>
          <TendenciaDiariaChart />
        </div>
        
        {/* Esta tarjeta se posicionará correctamente debajo del nuevo título */}
        <div className="dashboard-card chart-card">
          <h2>Distribución de Gastos por Categoría</h2>
          <GastosPorCategoriaChart />
        </div>

        {/* --- 2. AÑADE LA NUEVA TARJETA PARA EL GRÁFICO DE BARRAS --- */}
        <div className="dashboard-card chart-card">
          <h2>Historial de Ingresos vs. Gastos (Últimos 6 Meses)</h2>
          <HistorialMensualChart />
        </div>

        <div className="dashboard-card top-gastos-card">
          <h2>Top 5 Gastos del Mes</h2>
          <TopGastosChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;